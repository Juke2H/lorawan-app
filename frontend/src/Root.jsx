import { Route, Routes } from "react-router-dom";
import Home from "./components/home/home"
import Test from "./components/test/test"
import NodeInfo from "./components/nodeinfo/NodeInfo"

export default function Root() {
  return (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<Test />} />
        <Route path="/test2" element={<Test2 />} />
        <Route path="/NodeInfo" element={<NodeInfo />} />
    </Routes>
  );
}
