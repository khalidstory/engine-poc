const express = require('express');
const fs = require('fs');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { transform } = require('@babel/core');

const app = express();
app.use(express.json());

const applyStyles = (styleObj) => {
  let styleString = '';
  for (const [key, value] of Object.entries(styleObj)) {
    styleString += `${key}: ${value}; `;
  }
  return styleString;
};

const createElementFromJson = (component) => {
  const { tagName, attributes, content, styles } = component;
  return React.createElement(
    tagName,
    {
      ...attributes,
      style: styles
    },
    <div dangerouslySetInnerHTML={{ __html: content }} />
  );
};

app.post('/convert', (req, res) => {
  const json = req.body;

  const components = json.components.map((component) => createElementFromJson(component));
  const html = ReactDOMServer.renderToStaticMarkup(React.createElement('div', null, components));

  fs.writeFileSync('output.html', html);
  fs.writeFileSync('output.css', json.css);
  fs.writeFileSync('output.js', ''); // Add JS if required

  res.status(200).send('Files created successfully');
});

app.listen(3000, () => console.log('Server started on port 3000'));
