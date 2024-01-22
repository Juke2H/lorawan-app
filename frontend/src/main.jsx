import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import Root from './Root.jsx'
import Home from "./components/home/home.jsx"
import Test from "./components/test/test.jsx"
import Test2 from "./components/test/test2.jsx"
import NodeInfo from "./components/nodeinfo/NodeInfo.jsx"
import LatestMeasurement from './components/latestMeasurement/LatestMeasurement.jsx'
import dayPickerInside from "./components/dayPicker/dayPickerInside.jsx"
import dayPickerOutside from "./components/dayPicker/dayPickerOutside.jsx"
import './index.css'

const router = createBrowserRouter([
  { path: "/", Component: Home },
  { path: "*", Component: Root },
  { path: "/test", Component: Test },
  { path: "/test2", Component: Test2 },
  { path: "/NodeInfo", Component: NodeInfo },
  { path: "/LatestMeasurement", Component: LatestMeasurement},
  { path: "/dayPickerInside", Component: dayPickerInside },
  { path: "/dayPickerOutside", Component: dayPickerOutside },
]);

export default function App() {
  return <RouterProvider router={router} />;
}

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
