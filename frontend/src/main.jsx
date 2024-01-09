import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import Root from './Root.jsx'
import Home from "./components/home.jsx"
import Test from "./components/test.jsx"
import './index.css'

const router = createBrowserRouter([
  { path: "/", Component: Home },
  { path: "*", Component: Root },
  { path: "/test", Component: Test },
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
