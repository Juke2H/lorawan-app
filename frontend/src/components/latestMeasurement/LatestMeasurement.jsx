import React, { useState, useEffect } from "react";
import io from "socket.io-client";

// LatestMeasurement component function taking 'isOutside' prop
export default function LatestMeasurement ({ isOutside }) {
  const [responseBody, setResponseBody] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [node, setNode] = useState({});

  // Fetch data from the database when 'isOutside' prop changes
  useEffect(() => {
    fetchDataFromDatabase();
  }, [isOutside]);

  // Creating WebSocket connection to the backend server and listening for data updates
  useEffect(() => {
    const socket = io(import.meta.env.VITE_BACKEND_URL);

    socket.on("dataUpdated", fetchDataFromDatabase);
  }, []);

  // Function to fetch data from the database
  const fetchDataFromDatabase = async () => {
    setIsLoading(true);
    try {
      const endpoint = isOutside
        ? "getLatestOutsideMeasurement"
        : "getLatestInsideMeasurement";
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/${endpoint}`);
      const result = await response.json();

      setResponseBody(result.data);
      const { id, device_id, ...newObj } = result[0]; // Extract relevant data from response
      setNode(newObj);
    } catch (error) {
      console.error("Error fetching data from database:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to format timestamp
  function formatTimestamp(timestamp) {
    const dateObj = new Date(timestamp);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString("default", { month: "long" });
    const year = dateObj.getFullYear();
    const hours = dateObj.getHours().toString().padStart(2, "0"); // Get hours with leading zero if necessary
    const minutes = dateObj.getMinutes().toString().padStart(2, "0");
    const seconds = dateObj.getSeconds().toString().padStart(2, "0");

    return <p>{day}. {month} {year} <br /> klo: {hours}:{minutes}:{seconds}</p>;
  }

  // Function to format water leak status
  function waterLeak(isWaterLeaking) {
    if (isWaterLeaking == 0) {
      isWaterLeaking = "Ei";
    } else {
      isWaterLeaking = "Kyllä";
    }
    return isWaterLeaking;
  }
  // Return statement for a timestamp and three values
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