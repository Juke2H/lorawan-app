import React, { useState, useEffect } from "react";
import axios from "axios";

const LatestMeasurement = () => {
  const [responseBody, setResponseBody] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const MINUTE_MS = 60000;

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get(
          "http://localhost:3000/getLatestInsideMeasurement"
        );

        if (!ignore) {
          setResponseBody(response.data);
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
      fetchData();
    }, MINUTE_MS);

    return () => {
      clearInterval(interval);
      ignore = true;
    };
  }, []);

  // Render
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            {Object.keys(responseBody[0] || {}).map((heading) => (
              <th key={heading}>{heading}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {responseBody.length > 0 ? (
            <tr>
              {Object.values(responseBody[0] || {}).map((value, index) => (
                <td key={index}>{value}</td>
              ))}
            </tr>
          ) : (
            <tr>
              <td colSpan="6">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LatestMeasurement;
