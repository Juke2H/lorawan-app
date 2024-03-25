import "./PeopleCounter.css";
import { useState, useEffect } from "react";
import { format, isToday } from "date-fns";
import { fi } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import io from "socket.io-client";
import moment from 'moment';
import 'chartjs-adapter-moment';

export default function PeopleCounter() {
  const [selected, setSelected] = useState(new Date());
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDataFromDatabase();
  }, [selected]);

  useEffect(() => {
    if (isToday(selected)) {
      const socket = io(import.meta.env.VITE_BACKEND_URL);
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

  function formatTimestampForChart(timestamp) {
    const dateObj = new Date(timestamp);
    const hours = dateObj.getHours().toString().padStart(2, "0");
    const minutes = dateObj.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  function calculateTotalCounterAForDay(data) {
    let totalCounterA = 0;

    data && data.forEach(item => {
      totalCounterA += parseInt(item.counter_a);
    });

    return totalCounterA;
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
            <Bar
              data={{
                labels: fixedTimeLabels,
                datasets: [
                  {
                    label: "Kävijöitä",
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

                        tooltipContent.push(`Aika: ${formattedTimestamp}`);
                        tooltipContent.push(`Kävijöitä sisälle: ${item.counter_a}`);
                        tooltipContent.push(`Kävijöitä ulos: ${item.counter_b}`);

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
          <h4>Ei kävijöitä</h4>
        </div>
      </div>
    );

  return (
    <div>
      <div className="cal">
        <div className="chart">
          <Bar
            data={{
              labels: fixedTimeLabels,
              datasets: [
                {
                  label: "Kävijöitä",
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

                      tooltipContent.push(`Aika: ${formattedTimestamp}`);
                      tooltipContent.push(`Kävijöitä sisälle: ${item.counter_a}`);
                      tooltipContent.push(`Kävijöitä ulos: ${item.counter_b}`);

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
        <h4>Yhteensä {calculateTotalCounterAForDay(data)} kävijää</h4>
      </div>
    </div>
  );
}
