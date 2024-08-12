import React from "react";
import DraggableItem from "./DraggableItem";

const LeftSidebar = () => {
  return (
    <div className="left-sidebar">
      <h3>Components</h3>
      <DraggableItem type="input" tagName="input" label="Input Field" />
      <DraggableItem type="textarea" tagName="textarea" label="Text Area" />
      <DraggableItem type="text" tagName="div" label="Text" />
      <DraggableItem type="video" tagName="video" label="Video" />
      {/* <DraggableItem type="section" tagName="section" label="Section" /> */}
    </div>
  );
};

export default LeftSidebar;
