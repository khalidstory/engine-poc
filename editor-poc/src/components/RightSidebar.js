import React from "react";
import { useDrop } from "react-dnd";
import DropItem from "./DropItem";

const RightSidebar = ({ items, setItems }) => {
  const [, drop] = useDrop({
    accept: ["input", "textarea", "text", "section", "video", "source", "div"],
    drop: (item) => {
      let itemContent = "";
      let itemAttributes = {};
      if (item.type === "text") {
        itemContent = prompt("Please add item content") || "";
        console.log("itemContent:::", typeof itemContent);
      }
      if (item.type === "video") {
        itemAttributes = {
          width: "100%",
          height: "200px",
          autoplay: true,
          muted: true,
        };
        itemContent = (
          <source
            src={prompt("Please add your video source") || ""}
            type="video/mp4"
          />
        );

        console.log("itemContent:::", itemContent);
      }

      // if (itemContent.type === "source") {
      //   itemAttributes = {
      //     type: "video/mp4",
      //   };
      // }
      addItem(item.type, item.tagName, itemContent, itemAttributes);
    },
  });

  const addItem = (type, tagName, itemContent, itemAttributes) => {
    const newItem = {
      id: items.length,
      type: type,
      tagName: tagName,
      attributes: {
        class: "item",
        ...itemAttributes,
      },
      content: itemContent,
      styles: {
        minWidth: "100px",
      },
      components: handleComponents(itemContent),
    };
    console.log("🚀 ~ addItem ~ newItem:", newItem);

    function handleComponents(itemContent) {
      // if there is no content
      if (!itemContent) return [];

      let components = [];

      const handleChildren = (child) => {
        if (React.isValidElement(child)) {
          const content = child.props.children ?? child.props ?? "";
          const getAttributes = () => {
            const { children, ...rest } = child.props;
            return rest;
          };

          const childItem = addItem(
            child.type,
            child.type,
            content,
            getAttributes()
          );

          components.push(childItem);
        }
      };

      // if it's a single child element
      if (React.isValidElement(itemContent)) {
        handleChildren(itemContent);
      }

      // if it's multi children elements
      if (Array.isArray(itemContent)) {
        itemContent.forEach((item) => handleChildren(item));
      }

      return components;
    }

    setItems([...items, newItem]);

    return newItem; // Return the newly created item
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
