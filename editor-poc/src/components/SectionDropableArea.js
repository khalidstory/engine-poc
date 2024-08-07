import React from "react";

const SectionDropableArea = ({ item }) => {
  return (
    <section
      className={`design-element app-section ${item.attributes?.class}`}
      style={item.styles}
    >
      Drop Here
    </section>
  );
};

export default SectionDropableArea;
