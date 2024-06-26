import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import "./navBar.css";

// Define NavBar component
export default function NavBar() {
  const [activeButton, setActiveButton] = useState("none");
  const location = useLocation();

  // Effect to update the activeButton state based on the current location
  useEffect(() => {
    if (location.pathname === "/NodeInfoInside") {
      setActiveButton("inside");
    } else if (location.pathname === "/NodeInfoOutside") {
      setActiveButton("outside");
    } else if (location.pathname === "/PeopleCounter") {
      setActiveButton("peopleCounter");
    } else {
      setActiveButton("none");
    }
  }, [location]);

  // Render the NavBar component
  return (
    <div className="margin">
      <nav>
        <div className="navbar">
          <Link
            to="/NodeInfoInside"
            className="homeButtons"
          >
            <button
              className="navBtn"
              style={{
                backgroundColor:
                  activeButton === "inside" ? "black" : "#e21313",
                color: activeButton === "inside" ? "white" : "black",
              }}
            >
              Indoor sensor
            </button>
          </Link>
          <Link
            to="/PeopleCounter"
            className="homeButtons"
          >
            <button
              className="navBtn"
              style={{
                backgroundColor:
                  activeButton === "peopleCounter" ? "black" : "#e21313",
                color: activeButton === "peopleCounter" ? "white" : "black",
              }}
            >
              People counter
            </button>
          </Link>
          <Link
            to="/NodeInfoOutside"
            className="homeButtons"
          >
            <button
              className="navBtn"
              style={{
                backgroundColor:
                  activeButton === "outside" ? "black" : "#e21313",
                color: activeButton === "outside" ? "white" : "black",
              }}
            >
              Outdoor sensor
            </button>
          </Link>
        </div>
      </nav>
      <Outlet />
    </div>
  );
}
