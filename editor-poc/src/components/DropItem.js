import React from "react";

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
  return null;
};

export default DropItem;
