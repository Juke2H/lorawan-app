import './dayPicker.css'
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fi } from "date-fns/locale"
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { useNavigate } from "react-router-dom";
import { Chart as ChartJS } from "chart.js/auto";
import { Line } from "react-chartjs-2";

export default function DayPickerInside() {
  const [selected, setSelected] = useState(new Date());
  const [data, setData] = useState(null);
  const [isDataVisible, setDataVisibility] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDataFromDatabase = async () => {
      try {
        if (!selected) {
          setData(null);
          return;
        }
        const formattedDate = format(selected, 'yyyy-MM-dd');
        const response = await fetch(`http://localhost:3000/byDateInside?date=${formattedDate}`);
        const result = await response.json();

        setData(result);
      } catch (error) {
        console.error('Error fetching data from database:', error);
      }
    };

    fetchDataFromDatabase();
  }, [selected]);

  function goToHome() {
    navigate("/");
  }

  function toggleDataVisibility() {
    setDataVisibility(!isDataVisible);
  }

  function clockTime(timestamp) {
    const dateObj = new Date(timestamp);
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
  }

  function formatTimestamp(timestamp) {
    const dateObj = new Date(timestamp);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString('default', { month: 'long' });
    const year = dateObj.getFullYear();
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    const seconds = dateObj.getSeconds().toString().padStart(2, '0');

    return `${day}. ${month} ${year} klo: ${hours}:${minutes}:${seconds}`;
  }

  function waterLeak(isWaterLeaking) {

    if (isWaterLeaking == 0) {
      isWaterLeaking = "Ei"
    } else {
      isWaterLeaking = "Kyllä"
    }
    return isWaterLeaking
  }

  function calculateAverageTemperature() {

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


  if (selected && data && data.length === 0)
    return (
      <div>
        <button className='dayPickerButtons' onClick={() => goToHome()}>Takaisin</button>
        <h3>Valitse päivä</h3> <br></br>
        <DayPicker locale={fi} ISOWeek showOutsideDays fixedWeeks
          mode="single"
          selected={selected}
          onSelect={setSelected}
        />
        <div>
          <h4>Ei tietoja</h4>
        </div>
      </div>
    )

  return (
    <div className='dayPicker'>
      <button className='dayPickerButtons' onClick={() => goToHome()}>Takaisin</button>
      <h3>Valitse päivä</h3> <br></br>
      <DayPicker locale={fi} ISOWeek showOutsideDays fixedWeeks
        mode="single"
        selected={selected}
        onSelect={setSelected}
      />
      <div>
        <h4>Lämpötilan keskiarvo: {calculateAverageTemperature()}°C</h4>
      </div>
      <div>
        <div>
          <Line
            data={{
              labels: data && data.map((data) => clockTime(data.timestamp)),
              datasets: [
                {
                  label: "Lämpötila",
                  data: data && data.map((data) => data.temperature),
                  backgroundColor: "#064FF0",
                  borderColor: "#064FF0",
                }
              ],
            }}
          />
          <button className='dayPickerButtons' onClick={() => toggleDataVisibility()}>
            {isDataVisible ? 'Piilota datapisteet' : 'Näytä datapisteet'}
          </button>
        </div>
        {isDataVisible && data && data.map(item => (
          <div key={item.id}>
            <h4>{formatTimestamp(item.timestamp)}</h4>
            <p>Lämpötila: {item.temperature}°C</p>
            <p>Kosteus: {item.humidity}%</p>
            <p>Vesivahinko: {waterLeak(item.waterleak)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}