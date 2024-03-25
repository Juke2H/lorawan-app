import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NavBar from "./components/navBar/navBar.jsx";
import DashBoard from "./components/dashBoard/DashBoard.jsx";
import PeopleCounter from "./components/PeopleCounter/PeopleCounter.jsx";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <NavBar />,
    //errorElement: <NoPage />,
    children: [
      {
        path: "NodeInfoInside",
        element: <DashBoard isOutside={false}/>,
      },
      {
        path: "NodeInfoOutside",
        element: <DashBoard isOutside={true}/>,
      }, {
        path: "PeopleCounter",
        element: <PeopleCounter />,
      }
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
