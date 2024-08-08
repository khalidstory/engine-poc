const express = require("express");
const fs = require("fs");
const cors = require("cors");
const nunjucks = require("nunjucks");

const app = express();
app.use(express.json());
app.use(cors());

nunjucks.configure({ autoescape: true });

const componentTemplateSource = `<{{ tagName }} {% if attributes %} {% for key, value in attributes %} {{ key }}="{{ value }}" {% endfor %} {% endif %} style="{{ styleString }}">{{ content | safe }}</{{ tagName }}>`;

const renderComponent = (component) => {
  if (component && component.components && component.components.length > 0) {
    component.content = component.components.map(subComponent => {
      return renderComponent(subComponent);
    }).join('');
  }
  return nunjucks.renderString(componentTemplateSource, component);
};

const templateSource = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web Page</title>
    <link rel="stylesheet" href="output.css">
</head>
<body class="app-body">
{% for component in components %}
{{ component | safe }}
{% endfor %}
</body>
</html>
`;

const applyStyles = (styleObj) => {
  let styleString = "";
  for (const [key, value] of Object.entries(styleObj)) {
    styleString += `${key}: ${value};`;
  }
  return styleString;
};

app.post("/convert", (req, res) => {
  const json = req.body;
  const components = json.components.map((component) => {
    return {
      ...component,
      styleString: applyStyles(component.styles),
    };
  });

  const renderedComponents = components.map(renderComponent);
  const html = nunjucks.renderString(templateSource, { components: renderedComponents });

  fs.writeFileSync("output.html", html);
  fs.writeFileSync("output.css", json.globalCss);
  fs.writeFileSync("output.js", "");

  res.status(200).send("Files created successfully");
});

app.listen(3000, () => console.log("Server started on port 3000"));
