import { Route, Routes } from "react-router-dom";
import Home from "./components/home/home"
import Test from "./components/test/test"
import Test2 from "./components/test/test2"
import NodeInfo from "./components/nodeinfo/NodeInfo"
import LatestMeasurement from "./components/latestMeasurement/LatestMeasurement";
import DayPickerInside from "./components/dayPicker/dayPickerInside"
import DayPickerOutside from "./components/dayPicker/dayPickerOutside"

export default function Root() {
  return (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<Test />} />
        <Route path="/test2" element={<Test2 />} />
        <Route path="/NodeInfo" element={<NodeInfo />} />
        <Route path="/LatestMeasurement" element={<LatestMeasurement />} />
        <Route path="/dayPickerInside" element={<DayPickerInside />} />
        <Route path="/dayPickerOutside" element={<DayPickerOutside />} />
    </Routes>
  );
}
