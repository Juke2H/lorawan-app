import "./NodeInfo.css";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { fi } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import io from "socket.io-client";

export default function NodeInfo({ isOutside }) {
  const [selected, setSelected] = useState(new Date());
  const [data, setData] = useState(null);
  const [isDataVisible, setDataVisibility] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDataFromDatabase();
  }, [selected, isOutside]);

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
    try {
      if (!selected) {
        setData(null);
        return;
      }
      const endpoint = isOutside ? "byDateOutside" : "byDateInside";
      const formattedDate = format(selected, "yyyy-MM-dd");
      const response = await fetch(
        `http://localhost:3000/${endpoint}?date=${formattedDate}`
      );
      const result = await response.json();

      setData(result);
    } catch (error) {
      console.error("Error fetching data from database:", error);
    }
  };

  function toggleDataVisibility() {
    setDataVisibility(!isDataVisible);
  }

  function formatTimestamp(timestamp) {
    const dateObj = new Date(timestamp);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString("default", { month: "long" });
    const year = dateObj.getFullYear();
    const hours = dateObj.getHours().toString().padStart(2, "0");
    const minutes = dateObj.getMinutes().toString().padStart(2, "0");
    const seconds = dateObj.getSeconds().toString().padStart(2, "0");

    return `${day}. ${month} ${year} klo: ${hours}:${minutes}:${seconds}`;
  }

  function waterLeak(isWaterLeaking) {
    if (isWaterLeaking == 0) {
      isWaterLeaking = "Ei";
    } else {
      isWaterLeaking = "Kyllä";
    }
    return isWaterLeaking;
  }

  function calculateAverageTemperature() {
    if (!data || data.length === 0) {
      return 0;
    }
    const totalTemperature = data.reduce((sum, item) => {
      const temperature = parseFloat(item.temperature);
      return sum + (!isNaN(temperature) ? temperature : 0);
    }, 0);
    const averageTemperature = totalTemperature / data.length;
    if (isNaN(averageTemperature)) {
      return 0;
    }
    return averageTemperature.toFixed(1);
  }

  function roundTemperature(temperature) {
    if (!temperature && temperature !== 0) {
      return 0;
    }
    const roundedTemperature = (
      Math.round(parseFloat(temperature) * 2) / 2
    ).toFixed(1);
    const strippedTemperature = parseFloat(roundedTemperature); // Poista ylimääräiset desimaalit

    if (isNaN(strippedTemperature)) {
      return 0;
    }
    return strippedTemperature % 1 === 0
      ? strippedTemperature.toFixed(0)
      : strippedTemperature.toFixed(1);
  }

  function formatTimestampForChart(timestamp) {
    const dateObj = new Date(timestamp);
    const hours = dateObj.getHours().toString().padStart(2, "0");
    const minutes = dateObj.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  ChartJS.defaults.font.size = 14;
  ChartJS.defaults.font.weight = "bold";
  ChartJS.defaults.color = "#030101";

  if (!selected || (data && data.length === 0))
    return (
      <div>
     <div className="cal">
        <div className="chart">
          <Line
            data={{
              labels:
                data &&
                data.map((data) => formatTimestampForChart(data.timestamp)),
                // ["00:00", "02:00", "04:00", "06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00", "24:00"],
              datasets: [
                {
                  label: "Lämpötila",
                  data:
                    data &&
                    data.map((data) => ({
                      x: formatTimestampForChart(data.timestamp),
                      y: roundTemperature(data.temperature),
                    })),
                  backgroundColor: "#e21313",
                  borderColor: "#e21313",
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
              scales: {
                y: {
                  ticks: {
                    stepSize: 0.5,
                    callback: function (value, index, values) {
                      // Poista desimaalit, jos ne ovat nolla
                      return value % 1 === 0
                        ? value.toFixed(0)
                        : value.toFixed(1);
                    },
                  },
                },
              },
            }}
          />
        </div>
        <div className="dayPicker">
          <DayPicker
            locale={fi}
            ISOWeek
            showOutsideDays
            fixedWeeks
            mode="single"
            selected={selected}
            month={selected}
            onMonthChange={(month) => setSelected(month)}
            onSelect={(date) => {
              setSelected(date);
            }}
            modifiersClassNames={{
              selected: 'my-selected',
              today: 'my-today',  
          }}
          />
        </div>
      </div>
        <div className="NodeInfo">
          <h4>Ei tietoja</h4>
        </div>
      </div>
    );

  return (
    <div>
      <div className="cal">
        <div className="chart">
          <Line
            data={{
              labels:
                data &&
                data.map((data) => formatTimestampForChart(data.timestamp)),
                // ["00:00", "02:00", "04:00", "06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00", "24:00"],
              datasets: [
                {
                  label: "Lämpötila",
                  fontSize: 16,
                  data:
                    data &&
                    data.map((data) => ({
                      x: formatTimestampForChart(data.timestamp),
                      y: roundTemperature(data.temperature),
                    })),
                  backgroundColor: "#e21313",
                  borderColor: "#e21313",
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
              scales: {
                y: {
                  ticks: {
                    stepSize: 0.5,
                    callback: function (value, index, values) {
                      // Poista desimaalit, jos ne ovat nolla
                      return value % 1 === 0
                        ? value.toFixed(0)
                        : value.toFixed(1);
                    },
                  },
                },
              },
            }}
          />
        </div>
        <div className="dayPicker">
          <DayPicker
            locale={fi}
            ISOWeek
            showOutsideDays
            fixedWeeks
            mode="single"
            selected={selected}
            month={selected}
            onMonthChange={(month) => setSelected(month)}
            onSelect={(date) => {
              setSelected(date);
            }}
            modifiersClassNames={{
              selected: 'my-selected',
              today: 'my-today',
          }}
          />
        </div>
      </div>
      <div className="NodeInfo">
        <h4>Lämpötilan keskiarvo: {calculateAverageTemperature()}°C</h4>
      </div>
      {/* <div className='chart'>
        <Line
          data={{
            labels: data && data.map((data) => formatTimestampForChart(data.timestamp)),
            datasets: [
              {
                label: "Lämpötila",
                data: data && data.map((data) => ({
                  x: formatTimestampForChart(data.timestamp),
                  y: (roundTemperature(data.temperature))
                })),
                backgroundColor: "#064FF0",
                borderColor: "#064FF0",
              }
            ],
          }}
          options={{
            maintainAspectRatio: false,
            scales: {
              y: {
                ticks: {
                  stepSize: 0.5,
                  callback: function (value, index, values) { // Poista desimaalit, jos ne ovat nolla
                    return value % 1 === 0 ? value.toFixed(0) : value.toFixed(1);
                  },
                },
              },
            },
          }}
        />
      </div> */}
      <div className="NodeInfo">
        <button
          className="dayPickerButtons"
          onClick={() => toggleDataVisibility()}
          style={{
            backgroundColor: isDataVisible ? "black" : "#e21313",
            color: isDataVisible ? "white" : "black"
          }}
        >
          {isDataVisible ? "Piilota datapisteet" : "Näytä datapisteet"}
        </button>
      </div>
      <div className="dataPointsContainer">
        {isDataVisible &&
          data &&
          data.map((item) => (
            <div key={item.id} className="dataPoint">
              <h4>{formatTimestamp(item.timestamp)}</h4>
              <p>Lämpötila: {roundTemperature(item.temperature)}°C</p>
              <p>Kosteus: {item.humidity}%</p>
              {isOutside ? (
                <p>Ilmanpaine: {item.pressure} mbar</p>
              ) : (
                <p>Vesivahinko: {waterLeak(item.waterleak)}</p>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
