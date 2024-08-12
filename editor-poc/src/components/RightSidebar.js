import React from "react";
import { useDrop } from "react-dnd";
import DropItem from "./DropItem";

const RightSidebar = ({ items, setItems }) => {
  const [, drop] = useDrop({
    accept: ["input", "textarea", "text", "svg", "section"],
    drop: (item) => {
      let itemContent = "";
      if (item.type === "text") {
        itemContent = prompt("Please add item content") || "";
      }
      if (item.type === "svg") {
        itemContent = prompt("Please add SVG content") || "";
      }
      addItem(item.type, item.tagName, itemContent);
    },
  });

  const addItem = (type, tagName, itemContent) => {
    let itemAttributes = {
      class: "item",
    };

    let itemComponents = [];

    if (type === "svg") {
      itemAttributes = {
        width: "100%",
        height: "300px",
        xmlns: "http://www.w3.org/2000/svg",
      };

      itemComponents = [
        {
          id: 1,
          type: "rect",
          tagName: "rect",
          attributes: {
            x: "50",
            y: "50",
            width: "150",
            height: "100",
            fill: "red",
          },
        },
        {
          id: 2,
          type: "circle",
          tagName: "circle",
          attributes: {
            cx: "250",
            cy: "150",
            r: "50",
            fill: "green",
          },
        },
        {
          id: 3,
          type: "line",
          tagName: "line",
          attributes: {
            x1: "50",
            y1: "250",
            x2: "350",
            y2: "250",
            stroke: "blue",
            strokeWidth: "5",
          },
        },
        {
          id: 4,
          type: "text",
          tagName: "text",
          attributes: {
            x: "100",
            y: "350",
            fontFamily: "Arial",
            fontSize: "30",
            fill: "black",
          },
        },
      ];
    }

    setItems([
      ...items,
      {
        id: items.length,
        type: type,
        tagName: tagName,
        attributes: itemAttributes,
        content: itemContent,
        components: itemComponents,
        styles: {},
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
