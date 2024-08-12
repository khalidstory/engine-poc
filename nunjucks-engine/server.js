const express = require("express");
const fs = require("fs");
const cors = require("cors");
const nunjucks = require("nunjucks");
const axios = require("axios");
const prettier = require("prettier");

const app = express();
app.use(express.json());
app.use(cors());

nunjucks.configure({ autoescape: true });

const componentTemplateSource = `{% if tagName === 'img' %}
<{{ tagName }}{% if attributes %}{% for key, value in attributes %} {% if value === true %}{{ key }}{% else %}{{ key }}="{{ value }}"{% endif %}{% endfor %}{% endif %} style="{{ styleString }}" />
{% else %}
<{{ tagName }}{% if attributes %}{% for key, value in attributes %} {% if value === true %}{{ key }}{% else %}{{ key }}="{{ value }}"{% endif %}{% endfor %}{% endif %} style="{{ styleString }}">
  {{ content | safe }}
</{{ tagName }}>
{% endif %}`;

const renderComponent = (component) => {
  if (component && component.components && component.components.length > 0) {
    component.content = component.components
      .map((subComponent) => {
        return renderComponent(subComponent);
      })
      .join("");
  }
  return nunjucks.renderString(componentTemplateSource, component);
};

const templateSource = (tabName) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${tabName}</title>
    <link rel="stylesheet" href="output.css">
</head>
<body class="app-body">
{% for component in components %}
{{ component | safe }}
{% endfor %}
</body>
</html>
`;

const applyStyles = (styleObj = {}) => {
  let styleString = "";
  for (const [key, value] of Object.entries(styleObj)) {
    styleString += `${key}: ${value};`;
  }
  return styleString;
};

const convertComponentStyles = (component) => {
  return {
    ...component,
    styleString: applyStyles(component.styles),
    components:
      component.components?.map((component) => {
        return {
          ...convertComponentStyles(component),
        };
      }) ?? [],
  };
};

app.post("/convert", async (req, res) => {
  try {
    // Fetch tab name from the API
    const response = await axios.get(
      "https://api.jsonbin.io/v3/b/66b89c2dad19ca34f8948e28"
    );
    const tabName = response.data?.record?.tabName || "Default Tab Name";

    const json = req.body;
    const components = json.components?.map((component) => {
      return {
        ...convertComponentStyles(component),
      };
    });

    const renderedComponents = components.map(renderComponent);
    let html = nunjucks.renderString(templateSource(tabName), {
      components: renderedComponents,
    });

    // Prettify the HTML and CSS using Prettier
    html = await prettier.format(html, { parser: "html" });
    let css = await prettier.format(json.globalCss, { parser: "css" });

    fs.writeFileSync("output.html", html);
    fs.writeFileSync("output.css", css);
    fs.writeFileSync("output.js", "");

    res.status(200).send("Files created successfully");
  } catch (error) {
    console.error("Error fetching tab name:", error);
    res.status(500).send("Failed to create files");
  }
});

app.listen(3000, () => console.log("Server started on port 3000"));
