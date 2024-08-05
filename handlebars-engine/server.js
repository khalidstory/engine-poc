const express = require('express');
const fs = require('fs');
const Handlebars = require('handlebars');

const app = express();
app.use(express.json());

const templateSource = `
{{#each components}}
<{{tagName}} {{#each attributes}} {{@key}}="{{this}}"{{/each}} style="{{styleString}}">
  {{{content}}}
</{{tagName}}>
{{/each}}
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

  const template = Handlebars.compile(templateSource);
  const html = template({ components });

  fs.writeFileSync('output.html', html);
  fs.writeFileSync('output.css', json.css);
  fs.writeFileSync('output.js', ''); // Add JS if required

  res.status(200).send('Files created successfully');
});

app.listen(3000, () => console.log('Server started on port 3000'));
