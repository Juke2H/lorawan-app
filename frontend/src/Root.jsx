import { Route, Routes } from "react-router-dom";
import Home from "./components/home/home"
import NodeInfo from "./components/NodeInfo/NodeInfo.jsx";
import LatestMeasurement from "./components/latestMeasurement/LatestMeasurement";

export default function Root() {
  return (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/LatestMeasurement" element={<LatestMeasurement />} />
        <Route path="/NodeInfoInside" element={<NodeInfo isOutside={false}/>} />
        <Route path="/NodeInfoOutside" element={<NodeInfo isOutside={true}/>} />
    </Routes>
  );
}
