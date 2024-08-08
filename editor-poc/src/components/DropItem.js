import React from "react";
import SectionDropableArea from "./SectionDropableArea";

const renderSVGComponents = (components) => {
  return components.map((component, index) => {
    const { tagName, attributes } = component;
    return React.createElement(tagName, { key: index, ...attributes }, null);
  });
};

const DropItem = ({ item }) => {
  if (item.type === "input") {
    return (
      <input
        type="text"
        className={`design-element ${item.attributes?.class}`}
        style={item.styles}
      />
    );
  }
  if (item.type === "textarea") {
    return (
      <textarea
        className={`design-element ${item.attributes?.class}`}
        style={item.styles}
      />
    );
  }
  if (item.type === "text") {
    return (
      <div
        className={`design-element ${item.attributes?.class}`}
        style={item.styles}
      >
        {item.content}
      </div>
    );
  }
  if (item.type === "svg") {
    return (
      <div>
        <svg
          width={item.attributes.width}
          height={item.attributes.height}
          xmlns={item.attributes.xmlns}
          style={item.styles}
        >
          {/* Render SVG components */}
          {renderSVGComponents(item.components)}
        </svg>

        {/* Display item.content as text below the SVG */}
        {item.content && (
          <div
            style={{
              fontFamily: "Arial",
              fontSize: "16px",
              color: "black",
              textAlign:"center"
            }}
          >
            {item.content}
          </div>
        )}
      </div>
    );
  }
  if (item.type === "section") {
    return (
      <SectionDropableArea item={item}>{item.components}</SectionDropableArea>
    );
  }
  return null;
};

export default DropItem;
