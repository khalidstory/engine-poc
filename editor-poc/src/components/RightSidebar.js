import React from "react";
import { useDrop } from "react-dnd";
import DropItem from "./DropItem";

const RightSidebar = ({ items, setItems }) => {
  const [, drop] = useDrop({
    accept: ["input", "textarea", "text", "section"],
    drop: (item) => {
      let itemContent = "";
      if (item.type === "text") {
        itemContent = prompt("Please add item content") || "";
      }
      addItem(item.type, item.tagName, itemContent);
    },
  });

  const addItem = (type, tagName, itemContent) => {
    setItems([
      ...items,
      {
        id: items.length,
        type: type,
        tagName: tagName,
        attributes: {
          class: "item",
        },
        content: itemContent,
        styles: {
          minWidth: "100px",
        },
      },
    ]);
  };

  return (
    <div className="right-sidebar">
      <h3>Design Area</h3>
      <div ref={drop} className="design-area">
        {items.map((item) => (
          <DropItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default RightSidebar;
