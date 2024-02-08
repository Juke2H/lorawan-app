import React from "react";
import { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import "./navBar.css";

export default function NavBar() {
  //States for nav bar colors
  const [activeOne, setActiveOne] = useState(false);
  const [activeTwo, setActiveTwo] = useState(false);
  const [activeThree, setActiveThree] = useState(false);

  useEffect(() => {
    console.log(activeOne);
    console.log(activeTwo);
    console.log(activeThree);
  }, [activeOne, activeTwo, activeThree]);

  //Functions for nav bar colors
  const menuOne = () => {
    setActiveOne(true);
    setActiveTwo(false);
    setActiveThree(false);
  };

  const menuTwo = () => {
    setActiveOne(false);
    setActiveTwo(true);
    setActiveThree(false);
  };

  const menuThree = () => {
    setActiveOne(false);
    setActiveTwo(false);
    setActiveThree(true);
  };

  //return
  return (
    <div className="margin">
      <nav>
        <div className="navbar">
          <Link to="/NodeInfoInside" className="homeButtons" onClick={menuOne}>
            <button
              className="navBtn"
              style={{
                backgroundColor: activeOne ? "black" : "#e21313",
                color: activeOne ? "white" : "black"
              }}
            >
              Sisälämpömittari
            </button>
          </Link>
          <Link
            to="/NodeInfoOutside"
            className="homeButtons"
            onClick={menuTwo}
          >
            <button
              className="navBtn"
              style={{
                backgroundColor: activeTwo ? "black" : "#e21313",
                color: activeTwo ? "white" : "black"
              }}
            >
              Ulkolämpömittari
            </button>
          </Link>
          <Link
            to="/dashBoard"
            className="homeButtons"
            onClick={menuThree}
          >
            <button
              className="navBtn"
              style={{
                backgroundColor: activeThree ? "black" : "#e21313",
                color: activeThree ? "white" : "black"
              }}
            >
              Dashboard
            </button>
          </Link>
        </div>
      </nav>
      <Outlet />
    </div>
  );
}
