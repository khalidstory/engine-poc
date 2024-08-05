const express = require('express');
const fs = require('fs');
const nunjucks = require('nunjucks');

const app = express();
app.use(express.json());

nunjucks.configure({ autoescape: true });

const templateSource = `
{% for component in components %}
<{{ component.tagName }} {% for key, value in component.attributes %} {{ key }}="{{ value }}"{% endfor %} style="{{ component.styleString }}">
  {{ component.content | safe }}
</{{ component.tagName }}>
{% endfor %}
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

  const html = nunjucks.renderString(templateSource, { components });

  fs.writeFileSync('output.html', html);
  fs.writeFileSync('output.css', json.css);
  fs.writeFileSync('output.js', ''); // Add JS if required

  res.status(200).send('Files created successfully');
});

app.listen(3000, () => console.log('Server started on port 3000'));
