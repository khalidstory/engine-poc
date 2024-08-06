const express = require("express");
const fs = require("fs");
const cors = require("cors");
const pug = require("pug");

const app = express();
app.use(express.json());
app.use(cors());

const renderComponent = (component) => {
  if (component && component.components && component.components.length > 0) {
    component.content = component.components.map(subComponent => {
      return renderComponent(subComponent);
    }).join('');
  }
  
  let attributes = '';
  for (const [key, value] of Object.entries(component.attributes || {})) {
    attributes += ` ${key}="${value}"`;
  }

  return `<${component.tagName} style="${component.styleString}"${attributes}>${component.content || ''}</${component.tagName}>`;
};

const templateSource = `
doctype html
html(lang="en")
  head
    meta(charset="UTF-8")
    meta(name="viewport" content="width=device-width, initial-scale=1.0")
    title Web Page
    link(rel="stylesheet" href="output.css")
  body
    != components.join('')
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
  const html = pug.render(templateSource, { components: renderedComponents });

  fs.writeFileSync("output.html", html);
  fs.writeFileSync("output.css", json.globalCss);
  fs.writeFileSync("output.js", ""); // Add JS if required

  res.status(200).send("Files created successfully");
});

app.listen(3000, () => console.log("Server started on port 3000"));
