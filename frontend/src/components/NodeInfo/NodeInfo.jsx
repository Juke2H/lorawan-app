import "./NodeInfo.css";
import { useState, useEffect } from "react";
import { format, isToday } from "date-fns";
import { fi } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import io from "socket.io-client";
import moment from 'moment';
import 'chartjs-adapter-moment';

// Define NodeInfo component with a prop
export default function NodeInfo({ isOutside }) {
  const [selected, setSelected] = useState(new Date());
  const [data, setData] = useState(null);
  // const [isDataVisible, setDataVisibility] = useState(false);

  // Effect hook to fetch data from the database when selected date changes
  useEffect(() => {
    fetchDataFromDatabase();
  }, [selected]);

  // Effect hook to establish Socket.IO connection when selected date is today
  useEffect(() => {
    if (isToday(selected)) {
      const socket = io(import.meta.env.VITE_BACKEND_URL);
      socket.on("dataUpdated", fetchDataFromDatabase);
      return () => {
        socket.disconnect();
      };
    }
  }, [selected]);

  // Function to fetch data from the database based on the selected date
  const fetchDataFromDatabase = async () => {
    try {
      if (!selected) {
        setData(null); // Reset data if there is no selected date
        return;
      }
      const endpoint = isOutside ? "byDateOutside" : "byDateInside";
      const formattedDate = format(selected, "yyyy-MM-dd");
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/${endpoint}?date=${formattedDate}`
      );
      const result = await response.json();

      setData(result);
    } catch (error) {
      console.error("Error fetching data from database:", error);
    }
  };

  // Function to determine water leak status text based on numeric value
  function waterLeak(isWaterLeaking) {
    if (isWaterLeaking == 0) {
      isWaterLeaking = "No";
    } else {
      isWaterLeaking = "Yes";
    }
    return isWaterLeaking;
  }

  // Function to calculate average temperature from fetched data
  function calculateAverageTemperature() {
    if (!data || data.length === 0) {
      return 0;
    }
    const totalTemperature = data.reduce((sum, item) => {
      const temperature = parseFloat(item.temperature);
      return sum + (!isNaN(temperature) ? temperature : 0); // Add temperature to sum if it's a valid number
    }, 0);
    const averageTemperature = totalTemperature / data.length;
    if (isNaN(averageTemperature)) {
      return 0;
    }
    return averageTemperature.toFixed(1);
  }

  // Function to round temperature to 1 decimal place or whole number
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

  // Function to format timestamp for chart tooltip
  function formatTimestampForChart(timestamp) {
    const dateObj = new Date(timestamp);
    const hours = dateObj.getHours().toString().padStart(2, "0");
    const minutes = dateObj.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  // Configure Chart.js defaults
  ChartJS.defaults.font.size = 14;
  ChartJS.defaults.font.weight = "bold";
  ChartJS.defaults.color = "#030101";

  // Define fixed time labels for chart (00:00 - 24:00)
  const labels = Array.from({ length: 24 }, (_, i) => moment().startOf('day').add(i, 'hours').format('HH:mm'));
  const fixedTimeLabels = [
    "00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00",
    "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00",
    "20:00", "21:00", "22:00", "23:00", "24:00"
  ];

  // A conditional return if selected date is null or no data is fetched
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
                    label: "Temperature",
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

                        tooltipContent.push(`Timestamp: ${formattedTimestamp}`);

                        tooltipContent.push(
                          `Temperature: ${roundTemperature(item.temperature)}°C`
                        );
                        tooltipContent.push(`Humidity: ${item.humidity}%`);

                        if (isOutside) {
                          tooltipContent.push(
                            `Pressure: ${item.pressure} mbar`
                          );
                        } else {
                          tooltipContent.push(
                            `Waterleak: ${waterLeak(item.waterleak)}`
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
          <h4>No data</h4>
        </div>
      </div>
    );

  // Return line chart with fetched data and average temperature information
  return (
    <div>
      <div className="cal">
        <div className="chart">
          <Line
            data={{
              labels: fixedTimeLabels,
              datasets: [
                {
                  label: "Temperature",
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

                      tooltipContent.push(`Timestamp: ${formattedTimestamp}`);

                      tooltipContent.push(
                        `Temperature: ${roundTemperature(item.temperature)}°C`
                      );
                      tooltipContent.push(`Humidity: ${item.humidity}%`);

                      if (isOutside) {
                        tooltipContent.push(
                          `Pressure: ${item.pressure} mbar`
                        );
                      } else {
                        tooltipContent.push(
                          `Waterleak: ${waterLeak(item.waterleak)}`
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
        <h4>Average temperature: {calculateAverageTemperature()}°C</h4>
      </div>
    </div>
  );
}
