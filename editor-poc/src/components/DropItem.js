import React from "react";

const DropItem = ({ item }) => {
  if (item.type === "input") {
    return (
      <input
        type="text"
        className={`drop-item ${item.attributes?.class}`}
        style={item.styles}
      />
    );
  }
  if (item.type === "textarea") {
    return (
      <textarea
        className={`drop-item ${item.attributes?.class}`}
        style={item.styles}
      />
    );
  }
  if (item.type === "text") {
    return (
      <div
        className={`drop-item ${item.attributes?.class}`}
        style={item.styles}
      >
        {item.content}
      </div>
    );
  }
  return null;
};

export default DropItem;
