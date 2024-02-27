import "./NodeInfo.css";
import { useState, useEffect } from "react";
import { format, isToday } from "date-fns";
import { fi } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import io from "socket.io-client";
import moment from 'moment';
import 'chartjs-adapter-moment';

export default function NodeInfo({ isOutside }) {
  const [selected, setSelected] = useState(new Date());
  const [data, setData] = useState(null);
  // const [isDataVisible, setDataVisibility] = useState(false);

  useEffect(() => {
    fetchDataFromDatabase();
  }, [selected]);

  useEffect(() => {
    if (isToday(selected)) {
      const socket = io("http://localhost:3000");
      socket.on("dataUpdated", fetchDataFromDatabase);
      return () => {
        socket.disconnect();
      };
    }
  }, [selected]);

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

  // function toggleDataVisibility() {
  //   setDataVisibility(!isDataVisible);
  // }

  // function formatTimestamp(timestamp) {
  //   const dateObj = new Date(timestamp);
  //   const day = dateObj.getDate();
  //   const month = dateObj.toLocaleString("default", { month: "long" });
  //   const year = dateObj.getFullYear();
  //   const hours = dateObj.getHours().toString().padStart(2, "0");
  //   const minutes = dateObj.getMinutes().toString().padStart(2, "0");
  //   const seconds = dateObj.getSeconds().toString().padStart(2, "0");

  //   return <p>{day}. {month} {year} <br /> klo: {hours}:{minutes}:{seconds}</p>;
  // }

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
    const strippedTemperature = parseFloat(roundedTemperature);

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

  const labels = Array.from({ length: 24 }, (_, i) => moment().startOf('day').add(i, 'hours').format('HH:mm'));

  const fixedTimeLabels = [
    "00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00",
    "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00",
    "20:00", "21:00", "22:00", "23:00", "24:00"
  ];


  if (!selected || (data && data.length === 0))
    return (
      <div>
        <div className="cal">
          <div className="chart">
            <Line
              data={{
                labels: fixedTimeLabels,
                datasets: [
                  {
                    label: "Lämpötila",
                    data: data.map(data => ({
                      x: formatTimestampForChart(data.timestamp),
                      y: roundTemperature(data.temperature),
                    })),
                    backgroundColor: "#e21313",
                    borderColor: "#e21313",
                  },
                ],
              }}
              options={{
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: function (tooltipItems) {
                        const timestamp = tooltipItems.parsed.x;
                        const formattedTimestamp = moment(timestamp).format('HH:mm');

                        let item = data[tooltipItems.dataIndex];
                        let tooltipContent = [];

                        tooltipContent.push(`Aika: ${formattedTimestamp}`);

                        tooltipContent.push(
                          `Lämpötila: ${roundTemperature(item.temperature)}°C`
                        );
                        tooltipContent.push(`Kosteus: ${item.humidity}%`);

                        if (isOutside) {
                          tooltipContent.push(
                            `Ilmanpaine: ${item.pressure} mbar`
                          );
                        } else {
                          tooltipContent.push(
                            `Vesivuoto: ${waterLeak(item.waterleak)}`
                          );
                        }

                        return tooltipContent;
                      },
                    },
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    type: 'time',
                    time: {
                      parser: 'HH:mm',
                      unit: 'hour',
                      stepSize: 1,
                      displayFormats: {
                        hour: 'HH:mm'
                      }
                    },
                    ticks: {
                      source: 'labels',
                      stepSize: 1,
                      min: moment().startOf('day').subtract(1, 'hour'),
                      max: moment().endOf('day').add(1, 'hour'),
                      callback: function (value, index, values) {
                        return labels[index % labels.length];
                      }
                    }
                  },
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
                selected: "my-selected",
                today: "my-today",
              }}
              modifiersStyles={{
                disabled: { fontSize: "75%" },
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
              labels: fixedTimeLabels,
              datasets: [
                {
                  label: "Lämpötila",
                  data: data && data.map(data => ({
                    x: formatTimestampForChart(data.timestamp),
                    y: roundTemperature(data.temperature),
                  })),
                  backgroundColor: "#e21313",
                  borderColor: "#e21313",
                },
              ],
            }}
            options={{
              plugins: {
                tooltip: {
                  callbacks: {
                    label: function (tooltipItems) {
                      const timestamp = tooltipItems.parsed.x;
                      const formattedTimestamp = moment(timestamp).format('HH:mm');

                      let item = data[tooltipItems.dataIndex];
                      let tooltipContent = [];

                      tooltipContent.push(`Aika: ${formattedTimestamp}`);

                      tooltipContent.push(
                        `Lämpötila: ${roundTemperature(item.temperature)}°C`
                      );
                      tooltipContent.push(`Kosteus: ${item.humidity}%`);

                      if (isOutside) {
                        tooltipContent.push(
                          `Ilmanpaine: ${item.pressure} mbar`
                        );
                      } else {
                        tooltipContent.push(
                          `Vesivuoto: ${waterLeak(item.waterleak)}`
                        );
                      }

                      return tooltipContent;
                    },
                  },
                },
              },
              maintainAspectRatio: false,
              scales: {
                x: {
                  type: 'time',
                  time: {
                    parser: 'HH:mm',
                    unit: 'hour',
                    displayFormats: {
                      hour: 'HH:mm'
                    },
                    min: moment().startOf('day'),
                    max: moment().endOf('day')
                  }
                },
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
              selected: "my-selected",
              today: "my-today",
            }}
            modifiersStyles={{
              disabled: { fontSize: "75%" },
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
      {/* <div className="NodeInfo">
        <button
          className="dayPickerButtons"
          onClick={() => toggleDataVisibility()}
          style={{
            backgroundColor: isDataVisible ? "black" : "#e21313",
            color: isDataVisible ? "white" : "black",
          }}
        >
          {isDataVisible ? "Piilota datapisteet" : "Näytä datapisteet"}
        </button>
      </div>
      <div>
        <button
          onClick={() => {
            console.log(data);
          }}
        >
          Click
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
      </div> */}
    </div>
  );
}
