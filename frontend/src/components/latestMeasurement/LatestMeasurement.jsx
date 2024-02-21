import React, { useState, useEffect } from "react";
import io from "socket.io-client";

export default function LatestMeasurement ({ isOutside }) {
  const [responseBody, setResponseBody] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [node, setNode] = useState({});

  useEffect(() => {
    fetchDataFromDatabase();
  }, [isOutside]);

  useEffect(() => {
    const socket = io("http://localhost:3000");

    socket.on("dataUpdated", fetchDataFromDatabase);
  }, []);

  const fetchDataFromDatabase = async () => {
    setIsLoading(true);
    try {
      const endpoint = isOutside
        ? "getLatestOutsideMeasurement"
        : "getLatestInsideMeasurement";
      const response = await fetch(`http://localhost:3000/${endpoint}`);
      const result = await response.json();

      setResponseBody(result.data);
      const { id, device_id, ...newObj } = result[0];
      setNode(newObj);
    } catch (error) {
      console.error("Error fetching data from database:", error);
    } finally {
      setIsLoading(false);
    }
  };

  function formatTimestamp(timestamp) {
    const dateObj = new Date(timestamp);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString("default", { month: "long" });
    const year = dateObj.getFullYear();
    const hours = dateObj.getHours().toString().padStart(2, "0");
    const minutes = dateObj.getMinutes().toString().padStart(2, "0");
    const seconds = dateObj.getSeconds().toString().padStart(2, "0");

    return <p>{day}. {month} {year} <br /> klo: {hours}:{minutes}:{seconds}</p>;
  }

  function waterLeak(isWaterLeaking) {
    if (isWaterLeaking == 0) {
      isWaterLeaking = "Ei";
    } else {
      isWaterLeaking = "Kyllä";
    }
    return isWaterLeaking;
  }

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      <div className="nodes">
        <div className="nodeZero">
          {formatTimestamp(Object.values(node)[0])}
        </div>
        <div className="nodeOne">
          Lämpötila <br />
          {Object.values(node)[1]} °C
        </div>
        <div className="nodeTwo">
          Kosteus <br />
          {Object.values(node)[2]} %
        </div>
        {isOutside ? (
          <div className="nodeThree">
            Ilmanpaine <br />
            {Object.values(node)[3]} mbar
            </div>
          ) : (
        <div className="nodeThree">
          Vesivuoto <br />
          {waterLeak(Object.values(node)[3])}
        </div>
         )}
      </div>
      <div>
      </div>
    </div>
  );
}