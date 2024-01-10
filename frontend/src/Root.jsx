import { Route, Routes } from "react-router-dom";
import Home from "./components/home"
import Test from "./components/test"
import NodeInfo from "./components/nodeinfo/NodeInfo"

export default function Root() {
  return (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<Test />} />
        <Route path="/NodeInfo" element={<NodeInfo />} />
    </Routes>
  );
}
