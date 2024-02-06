import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { faker } from "@faker-js/faker";
import DayPickerInside from "../dayPicker/dayPickerInside";
import "./DashBoard.css";

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

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  //data.map timestamp?
  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Dataset 1",
        //data.map data?
        data: labels.map(() => faker.number.int({ min: -1000, max: 1000 })),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Dataset 2",
        data: labels.map(() => faker.number.int({ min: -1000, max: 1000 })),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        display: false,
      },
      title: {
        display: true,
        text: "Chart.js Line Chart",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.parsed.y + " °C";
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: function (value, index, ticks) {
            return value + " °C";
          },
        },
      },
    },
  };

  if (isLoading) {
    return <div>Loading...</div>;
  } else if (Object.values(node).length === 4) {
    return (
      <div>
        <div className="textInfo">{Object.values(node)[0]}</div>
        <div className="nodeInfo">
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
          <div className="käyrä"><Line options={options} data={data} /></div>
          <div className="kalenter"><DayPickerInside /></div>
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

export default DashBoard;
