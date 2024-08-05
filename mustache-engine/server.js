const express = require('express');
const fs = require('fs');
const Mustache = require('mustache');

const app = express();
app.use(express.json());

const templateSource = `
{{#components}}
<{{tagName}} {{#attributes}} {{@key}}="{{this}}"{{/attributes}} style="{{styleString}}">
  {{{content}}}
</{{tagName}}>
{{/components}}
`;

const applyStyles = (styleObj) => {
  let styleString = '';
  for (const [key, value] of Object.entries(styleObj)) {
    styleString += `${key}: ${value}; `;
  }
  return styleString;
};

app.post('/convert', (req, res) => {
  const json = req.body;

  const components = json.components.map((component) => {
    return {
      ...component,
      styleString: applyStyles(component.styles)
    };
  });

  const html = Mustache.render(templateSource, { components });

  fs.writeFileSync('output.html', html);
  fs.writeFileSync('output.css', json.css);
  fs.writeFileSync('output.js', ''); // Add JS if required

  res.status(200).send('Files created successfully');
});

app.listen(3000, () => console.log('Server started on port 3000'));
