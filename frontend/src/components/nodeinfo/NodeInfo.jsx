import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

const NodeInfo = () => {
  //functions
  const [responseBody, setResponseBody] = useState("");

  const GetUser = () => {
    const options = {
      method: "GET",
      url: "http://localhost:3000/getInsideMeasurementsByID",
    };
    try {
      axios.request(options).then(function (response) {
        console.log(response.data);
        const responseJson = JSON.stringify(response.data);
        setResponseBody(responseJson);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const GetAnotherUser = () => {
    try {
      axios
        .get("http://localhost:3000/getInsideMeasurementsByTime")
        .then(function (response) {
          console.log(response.data);
          const responseJson = JSON.stringify(response.data);
          setResponseBody(responseJson);
        });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    GetUser();
  }, []);

  //return
  return (
    <div>
      <button onClick={() => GetUser()}>Click</button> <br />
      <button onClick={() => GetAnotherUser()}>Clickety</button> <br />
      <div>{responseBody}</div>
    </div>
  );
};

export default NodeInfo;
