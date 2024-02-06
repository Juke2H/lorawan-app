import './home.css'
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  function goDayPickerInside() {
    navigate("/NodeInfoInside");
  }
  function goDayPickerOutside() {
    navigate("/NodeInfoOutside");
  }
  function goLatestMeasurement() {
    navigate("/LatestMeasurement");
  }

  return (
    <div className='homePage'>
      <h1>Lorawan Anturit</h1>
        <button className='homeButtons' onClick={goDayPickerInside}>
          Sisälämpökalenteri
        </button>
        <button className='homeButtons' onClick={goDayPickerOutside}>
          Ulkolämpökalenteri
        </button>
        <button className='homeButtons' onClick={goLatestMeasurement}>
          Sisälämpöviimeisin
        </button>
      </div>
  )
}