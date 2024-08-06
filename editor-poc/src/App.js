import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import LeftSidebar from "./components/LeftSidebar";
import RightSidebar from "./components/RightSidebar";
import "./App.css";

const JSToCSS = (JS) => {
  let cssString = Object.keys(JS).reduce(
    (acc, key) => ({
      ...acc,
      [key.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`) + ""]: JS[key],
    }),
    {}
  );

  return cssString;
};

function App() {
  const [items, setItems] = useState([]);

  const handlePublish = () => {
    const data = items.map((item) => ({
      ...item,
      styles: JSToCSS(item.styles),
    }));

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      globalCss: `      
body {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.item {
  margin: 10px 0;
}`.trim(),
      components: data,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("http://localhost:3000/convert", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  };

  return (
    <div className="App">
      <div style={{ textAlign: "end", margin: 8 }}>
        <button onClick={handlePublish}>Publish</button>
      </div>
      <DndProvider backend={HTML5Backend}>
        <div className="container">
          <LeftSidebar />
          <RightSidebar items={items} setItems={setItems} />
        </div>
      </DndProvider>
    </div>
  );
}

export default App;