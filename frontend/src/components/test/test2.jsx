import '/src/App.css'
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function NodeInfo2() {
  //functions
  const [responseBody2, setResponseBody2] = useState([]);

  useEffect(() => {
    getOutsideByTime();
  }, []);

  const navigate = useNavigate();

  function goToHome() {
    navigate("/");
  }

  const getOutsideByTime = () => {
    try {
      axios
        .get("http://localhost:3000/getOutsideMeasurementsByTime")
        .then(function (response) {
          console.log(response.data);
          const responseJson2 = response.data;
          setResponseBody2(responseJson2);
        });
    } catch (error) {
      console.error(error);
    }
  };

  function formatTimestamp(timestamp) {
    const dateObj = new Date(timestamp);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString('default', { month: 'long' });
    const year = dateObj.getFullYear();
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
  
    return `${day}. ${month} ${year} klo ${hours}:${minutes}`;
  }

  //return
  return (
    <div>
      <button className='button' onClick={() => goToHome()}>Home</button>
      <button className='button' onClick={() => getOutsideByTime()}>Update</button> <br />
      <div>
        <h3>Ulkolämpöanturi</h3>
      {responseBody2.map(item => (
        <div key={item.id}>
        {/* <p>Device ID: {item.device_id}</p> */}
        <h4>{formatTimestamp(item.timestamp)}</h4>
        <p>Lämpötila: {item.temperature}°C</p>
        <p>Kosteus: {item.humidity}%</p>
        <p>Ilmanpaine: {item.pressure}mbar</p>
      </div>
      ))}
      </div>
    </div>
    )
}