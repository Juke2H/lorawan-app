import { useState } from "react";
import NodeInfo from "./components/nodeinfo/NodeInfo";
import LatestMeasurement from "./components/latestMeasurement/LatestMeasurement";
import "./App.css";

function App() {
  return (
    <>
      <div>
        <LatestMeasurement />
      </div>
    </>
  );
}

export default App;
