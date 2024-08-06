import React from "react";
import { useDrag } from "react-dnd";

const DraggableItem = ({ type, tagName, label }) => {
  const [{ isDragging }, drag] = useDrag({
    type,
    item: { type, tagName },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className="draggable-item"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {label}
    </div>
  );
};

export default DraggableItem;
