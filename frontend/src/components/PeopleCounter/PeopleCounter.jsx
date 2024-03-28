import "./PeopleCounter.css";
import { useState, useEffect } from "react";
import { format, isToday } from "date-fns";
import { fi } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import io from "socket.io-client";
import moment from 'moment';
import 'chartjs-adapter-moment';

// Define PeopleCounter component
export default function PeopleCounter() {
  const [selected, setSelected] = useState(new Date());
  const [data, setData] = useState(null);

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
        setData(null);
        return;
      }
      const formattedDate = format(selected, "yyyy-MM-dd");
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/byDatePC?date=${formattedDate}`
      );
      const result = await response.json();

      setData(result);
    } catch (error) {
      console.error("Error fetching data from database:", error);
    }
  };

  // Function to format timestamp for chart tooltip
  function formatTimestampForChart(timestamp) {
    const dateObj = new Date(timestamp);
    const hours = dateObj.getHours().toString().padStart(2, "0");
    const minutes = dateObj.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  // Function to calculate total counter A for the selected day
  function calculateTotalCounterAForDay(data) {
    let totalCounterA = 0;

    data && data.forEach(item => {
      totalCounterA += parseInt(item.counter_a);
    });

    return totalCounterA;
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
            <Bar
              data={{
                labels: fixedTimeLabels,
                datasets: [
                  {
                    label: "Visitors",
                    data: data && data.map(data => ({
                      x: formatTimestampForChart(data.timestamp),
                      y: data.counter_a,
                    })),
                    backgroundColor: "#e21313",
                    borderColor: "#e21313",
                  },
                ],
              }}
              options={{
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
                    suggestedMin: 0,
                    suggestedMax: 100,
                    ticks: {
                      stepSize: 10,
                      callback: function (value, index, values) {
                        return value;
                      }
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
          <h4>No visitors</h4>
        </div>
      </div>
    );
    
  // Return bar chart with fetched data and total counter A information
  return (
    <div>
      <div className="cal">
        <div className="chart">
          <Bar
            data={{
              labels: fixedTimeLabels,
              datasets: [
                {
                  label: "Visitors",
                  data: data && data.map(data => ({
                    x: formatTimestampForChart(data.timestamp),
                    y: data.counter_a,
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
                      tooltipContent.push(`Visitors coming in: ${item.counter_a}`);
                      tooltipContent.push(`Visitors leaving: ${item.counter_b}`);

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
                  suggestedMin: 0,
                  suggestedMax: 100,
                  ticks: {
                    stepSize: 10,
                    callback: function (value, index, values) {
                      return value;
                    }
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
        <h4>Total: {calculateTotalCounterAForDay(data)} visitors</h4>
      </div>
    </div>
  );
}
