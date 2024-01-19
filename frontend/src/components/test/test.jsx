import '/src/App.css'
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function NodeInfo1() {
  //functions
  const [responseBody, setResponseBody] = useState([]);

  useEffect(() => {
    getInsideByTime();
  }, []);

  const navigate = useNavigate();

  function goToHome() {
    navigate("/");
  }

  const getInsideByTime = () => {
    const options = {
      method: "GET",
      url: "http://localhost:3000/getInsideMeasurementsByTime",
    };
    try {
      axios.request(options).then(function (response) {
        console.log(response.data);
        const responseJson = response.data;
        setResponseBody(responseJson);
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
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    const seconds = dateObj.getSeconds();
  
    return `${day}. ${month} ${year} klo ${hours}:${minutes}:${seconds}`;
  }

  function waterLeak(isWaterLeaking) {

    if (isWaterLeaking == 0) {
      isWaterLeaking = "Ei"
    } else {
      isWaterLeaking = "Kyllä"
    }
    return isWaterLeaking
  }

  //return
  return (
    <div>
      <button className='button' onClick={() => goToHome()}>Home</button>
      <button className='button' onClick={() => getInsideByTime()}>Update</button> <br />
      <div>
      <h3>Sisälämpöanturi</h3>
      {responseBody.map(item => (
        <div key={item.id}>
        <h4>{formatTimestamp(item.timestamp)}</h4>
        <p>Lämpötila: {item.temperature}°C</p>
        <p>Kosteus: {item.humidity}%</p>
        <p>Vesivahinko: {waterLeak(item.waterleak)}</p>
      </div>
      ))}
      </div>
    </div>
    )
}