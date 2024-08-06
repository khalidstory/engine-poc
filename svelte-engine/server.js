const express = require('express');
const fs = require('fs');
const { compile } = require('svelte/compiler');

const app = express();
app.use(express.json());

const applyStyles = (styleObj) => {
  let styleString = '';
  for (const [key, value] of Object.entries(styleObj)) {
    styleString += `${key}: ${value}; `;
  }
  return styleString;
};

const createComponent = (component) => {
  const { tagName, attributes, content, styles } = component;
  const props = Object.entries(attributes).map(([key, value]) => `${key}="${value}"`).join(' ');
  return `<${tagName} ${props} style="${applyStyles(styles)}">${content}</${tagName}>`;
};

app.post('/convert', (req, res) => {
  const json = req.body;

  const components = json.components.map(createComponent).join('\n');
  const html = `<div>${components}</div>`;

  const { js, css } = compile(html, { generate: 'dom', css: "injected" });

  fs.writeFileSync('output.html', html);
  fs.writeFileSync('output.css', css.code);
  fs.writeFileSync('output.js', js.code);

  res.status(200).send('Files created successfully');
});

app.listen(3000, () => console.log('Server started on port 3000'));
