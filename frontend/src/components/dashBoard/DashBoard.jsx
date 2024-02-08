import React, { useState, useEffect } from "react";
import axios from "axios";
import NodeInfo from "../NodeInfo/NodeInfo";
import "./DashBoard.css";

const DashBoard = ({ isOutside }) => {
  const [responseBody, setResponseBody] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [node, setNode] = useState({});

  const MINUTE_MS = 10000000;

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
          const { id, device_id, ...newObj } = response.data[0];
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
          const { id, device_id, ...newObj } = response.data[0];
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
          {isOutside ? <div><NodeInfo isOutside={true}/></div> : <NodeInfo isOutside={false} />}
        </div>
      </div>
    );
  } else {
    return <div>{Object.values(node).length}</div>;
  }
};

export default DashBoard;
