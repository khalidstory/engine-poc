import React from "react";
import SectionDropableArea from "./SectionDropableArea";

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
  if (item.type === "section") {
    return (
      <SectionDropableArea item={item}>{item.components}</SectionDropableArea>
    );
  }
  return null;
};

export default DropItem;
