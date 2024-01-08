import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import App from './App.jsx'
import './index.css'

const router = createBrowserRouter([
  {
    path: "/", // The root path
    element: <App />, // Main layout component for the root path
    //errorElement: <NoPage />, // Component to render in case of an error
    children: [
      /*{
        path: "asd",
        element: <asd />
      }, {
        path: "asd2",
        element: <asd2 />
      } */
    ]
  }
])

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <RouterProvider router={router} /> {/* Provide the router to the application */}
  </React.StrictMode>
);
