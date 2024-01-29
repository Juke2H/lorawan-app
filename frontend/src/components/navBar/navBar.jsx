import React from "react";
import { Outlet, Link } from "react-router-dom";

export default function NavBar() {
  return (
    <>
      <nav>
        <div>
          <h1>Lorawan Anturit</h1>
          <button className="homeButtons">
            <Link to="/dayPickerInside">Sisälämpökalenteri</Link>
          </button>
          <button className="homeButtons">
            <Link to="/dayPickerOutside">Ulkolämpökalenteri</Link>
          </button>
          <button className="homeButtons">
            <Link to="/latestMeasurement">Sisälämpöviimeisin</Link>
          </button>
        </div>
      </nav>
      <Outlet />
    </>
  );
}
