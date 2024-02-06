import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./Root.jsx";
import Home from "./components/home/home.jsx";
import NavBar from "./components/navBar/navBar.jsx";
import Test from "./components/test/test.jsx";
import Test2 from "./components/test/test2.jsx";
import NodeInfo from "./components/nodeinfo/NodeInfo.jsx";
import DashBoard from "./components/dashBoard/DashBoard.jsx";
import DayPickerInside from "./components/dayPicker/dayPickerInside.jsx";
import DayPickerOutside from "./components/dayPicker/dayPickerOutside.jsx";
import "./index.css";

// const router = createBrowserRouter([
//   { path: "/", Component: Home },
//   { path: "*", Component: Root },
//   { path: "/test", Component: Test },
//   { path: "/test2", Component: Test2 },
//   { path: "/NodeInfo", Component: NodeInfo },
//   { path: "/LatestMeasurement", Component: LatestMeasurement},
//   { path: "/dayPickerInside", Component: dayPickerInside },
//   { path: "/dayPickerOutside", Component: dayPickerOutside },
// ]);

const router = createBrowserRouter([
  {
    path: "/",
    element: <NavBar />,
    //errorElement: <NoPage />,
    children: [
      {
        path: "dayPickerInside",
        element: <DayPickerInside />,
      },
      {
        path: "dayPickerOutside",
        element: <DayPickerOutside />,
      },
      {
        path: "nodeInfo",
        element: <NodeInfo />,
      },
      {
        path: "dashBoard",
        element: <DashBoard />,
      },
    ],
  },
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
