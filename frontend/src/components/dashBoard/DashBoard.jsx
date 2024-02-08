import React, { useState, useEffect } from "react";
import axios from "axios";
import NodeInfo from "../NodeInfo/NodeInfo";
import io from "socket.io-client";
import "./DashBoard.css";

const DashBoard = ({ isOutside }) => {
  const [responseBody, setResponseBody] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [node, setNode] = useState({});

  useEffect(() => {
    fetchDataFromDatabase();
  }, [isOutside]);

  useEffect(() => {
    const socket = io("http://localhost:3000");

    socket.on("connect", () => {
      console.log("SOCKET CONNECTION", socket.connected);
    });

    socket.on("disconnect", () => {
      console.log("SOCKET CONNECTION", socket.connected);
    });

    socket.on("dataUpdated", fetchDataFromDatabase);
  }, []);

  const fetchDataFromDatabase = async () => {
    setIsLoading(true);
    try {
      const endpoint = isOutside
        ? "getLatestInsideMeasurement"
        : "getLatestInsideMeasurement";
      // const formattedDate = format(selected, "yyyy-MM-dd");
      // const response = await fetch(
      //   `http://localhost:3000/${endpoint}?date=${formattedDate}`
      // );
      const response = await fetch(`http://localhost:3000/${endpoint}`);
      const result = await response.json();
      console.log(response);
      console.log(result);

      setResponseBody(result.data);
      const { id, device_id, ...newObj } = result[0];
      console.log(newObj);
      setNode(newObj);
    } catch (error) {
      console.error("Error fetching data from database:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  } else if (Object.values(node).length === 4) {
    return (
      <div>
        <div className="textInfo">{Object.values(node)[0]}</div>
        <div className="nodes">
          <div className="nodeZero">
            Lämpötila <br />
            {Object.values(node)[1]}
          </div>
          <div className="nodeOne">
            Kosteus <br />
            {Object.values(node)[2]}
          </div>
          <div className="nodeTwo">
            Vesivuoto <br />
            {Object.values(node)[3]}
          </div>
          <div className="nodeThree"></div>
        </div>
        <div className="cldr">
          {isOutside ? (
            <div>
              <NodeInfo isOutside={true} />
            </div>
          ) : (
            <NodeInfo isOutside={false} />
          )}
        </div>
      </div>
    );
  } else {
    return <div>{Object.values(node).length}</div>;
  }
};

export default DashBoard;
