import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./Root.jsx";
import Home from "./components/home/home.jsx";
import NavBar from "./components/navBar/navBar.jsx";
import NodeInfo from "./components/NodeInfo/NodeInfo.jsx";
import LatestMeasurement from "./components/latestMeasurement/LatestMeasurement.jsx";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <NavBar />,
    //errorElement: <NoPage />,
    children: [
      {
        path: "NodeInfoInside",
        element: <NodeInfo isOutside={false}/>,
      },
      {
        path: "NodeInfoOutside",
        element: <NodeInfo isOutside={true}/>,
      },
      {
        path: "latestMeasurement",
        element: <LatestMeasurement />,
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
