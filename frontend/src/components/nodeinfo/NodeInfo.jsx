import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

const NodeInfo = () => {
  //functions
  //Maybe write this to be generic at some point?
  const [responseBody, setResponseBody] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let ignore = false;

    const GetUser = () => {
      const options = {
        method: "GET",
        url: "http://localhost:3000/getInsideMeasurementsByID",
      };
      try {
        axios.request(options).then(function (response) {
          console.log(`Data: ${JSON.stringify(response.data)}`);

          //Iterate over the response
          for (let i of response.data) {
            console.log(i);

            //If the id isn't in state and if state isn't ignored, set state
            if (responseBody.some((element) => element.id === i.id)) {
              return;
            } else {
              if (!ignore) {
                setResponseBody((prev) => [...prev, i]);
              }
            }
          }
        });
      } catch (error) {
        console.error(error);
      }
    };

    //Get request with loader state start and end
    setIsLoading(true);
    GetUser();
    setIsLoading(false);

    return () => {
      ignore = true;
    };
  }, [responseBody]);

  //return
  //if load complete, show table, else don't
  if (!isLoading) {
    return (
      <div>
        <table>
          <thead>
            <tr>
              {
              // responseBody[0] is null if array is empty, so there's an or operator
              Object.keys(responseBody[0] || {}).map((heading) => {
                return <th>{heading}</th>;
              })
              }
            </tr>
          </thead>
          <tbody>
            {responseBody.map((item) => {
              return (
                <tr>
                  {Object.values(item).map((value) => {
                    return <td>{value}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
};

export default NodeInfo;
