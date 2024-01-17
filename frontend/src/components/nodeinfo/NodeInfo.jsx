import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

const NodeInfo = () => {
  //functions
  //Needs better render code
  const [responseBody, setResponseBody] = useState([]);
  const [node, setNode] = useState([]);
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

    const GetNode = (arr) => {
      if (!ignore) {
        for (let i of arr) {
          //...newObj is a new object without id and device_id
          //newObj can also be edited further after
          const { id, device_id, ...newObj } = i;
          console.log(i);
          console.log(newObj);
          setNode((prev) => [...prev, newObj]);
        }
      }
    };

    GetNode(responseBody);

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
                // node[0] is null if array is empty, so there's an or operator
                Object.keys(node[0] || {}).map((heading) => {
                  return <th key={heading}>{heading}</th>;
                })
              }
            </tr>
          </thead>
          <tbody>
            {node.map((item) => {
              return (
                <tr>
                  {Object.values(item || {}).map((value, index) => {
                    return <td key={index}>{value}</td>;
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
