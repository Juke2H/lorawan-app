import { Route, Routes } from "react-router-dom";
import Home from "./components/home"
import Test from "./components/test"

export default function Root() {
  return (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<Test />} />
    </Routes>
  );
}
