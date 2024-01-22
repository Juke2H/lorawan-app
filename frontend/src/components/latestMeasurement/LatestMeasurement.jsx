import React, { useState, useEffect } from "react";
import axios from "axios";
import "./LatestMeasurement.css";

const LatestMeasurement = () => {
  const [responseBody, setResponseBody] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [node, setNode] = useState({});

  const MINUTE_MS = 60000;

  useEffect(() => {
    let ignore = false;

    const FetchData = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get(
          "http://localhost:3000/getLatestInsideMeasurement"
        );

        if (!ignore) {
          setResponseBody(response.data);
          const { id, device_id, timestamp, ...newObj } = response.data[0];
          console.log(newObj);
          setNode(newObj);
          console.log("Response Data:", JSON.stringify(response.data));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    const interval = setInterval(() => {
      console.log("Logs every minute");
      FetchData();
    }, MINUTE_MS);

    return () => {
      clearInterval(interval);
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false;

    const FetchData = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get(
          "http://localhost:3000/getLatestInsideMeasurement"
        );

        if (!ignore) {
          setResponseBody(response.data);
          const { id, device_id, timestamp, ...newObj } = response.data[0];
          console.log(newObj);
          setNode(newObj);
          console.log("Response Data:", JSON.stringify(response.data));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    FetchData();

    return () => {
      ignore = true;
    };
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  } else if (Object.values(node).length === 3) {
    return (
      <div>
        <div className="nodesLatestMeasurement">
          <div className="nodeZero">{Object.values(node)[0]}</div>
          <div className="nodeOne">{Object.values(node)[1]}</div>
          <div className="nodeTwo">{Object.values(node)[2]}</div>
          <div className="nodeThree"></div>
        </div>
      </div>
    );
  } else {
    return <div>{Object.values(node).length}</div>;
  }

  /* return (
    <div>
      {<table>
        <thead>
          <tr>
            {Object.keys(node || {}).map((heading) => (
              <th key={heading}>{heading}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {responseBody.length > 0 ? (
            <tr>
              {Object.values(node || {}).map((value, index) => (
                <td key={index}>{value}</td>
              ))}
            </tr>
          ) : (
            <tr>
              <td colSpan="6">No data available</td>
            </tr>
          )}
        </tbody>
          </table> }
    </div> 
  ); */
};

export default LatestMeasurement;
