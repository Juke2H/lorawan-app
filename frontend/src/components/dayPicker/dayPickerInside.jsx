import '/src/App.css'
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fi } from "date-fns/locale"
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { useNavigate } from "react-router-dom";

export default function DayPickerInside() {
  const [selected, setSelected] = useState(new Date());
  const [data, setData] = useState(null);

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

  const navigate = useNavigate();

  function goToHome() {
    navigate("/");
  }

  function formatTimestamp(timestamp) {
    const dateObj = new Date(timestamp);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString('default', { month: 'long' });
    const year = dateObj.getFullYear();
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    const seconds = dateObj.getSeconds();
  
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
  
  if (selected && data && data.length === 0)
    return (
      <div>
        <button className='button' onClick={() => goToHome()}>Takaisin</button>
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
    <div>
      <button className='button' onClick={() => goToHome()}>Takaisin</button>
      <h3>Valitse päivä</h3> <br></br>
      <DayPicker locale={fi} ISOWeek showOutsideDays fixedWeeks
        mode="single"
        selected={selected}
        onSelect={setSelected}
      />
      <div>
        {data && data.map(item => (
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