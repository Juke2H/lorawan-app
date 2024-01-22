import '/src/App.css'
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  // function goToTest() {
  //   navigate("/test");
  // }
  // function goToTest2() {
  //   navigate("/test2");
  // }
  function goDayPickerInside() {
    navigate("/dayPickerInside");
  }
  function goDayPickerOutside() {
    navigate("/dayPickerOutside");
  }
  function goLatestMeasurement() {
    navigate("/LatestMeasurement");
  }

  return (
    <div className="nodes">
      <h1>Lorawan Anturit</h1>
        <button className='button' onClick={goDayPickerInside}>
          Sisälämpökalenteri
        </button>
        <button className='button' onClick={goDayPickerOutside}>
          Ulkolämpökalenteri
        </button>
        <button className='button' onClick={goLatestMeasurement}>
          Sisälämpöviimeisin
        </button>
      </div>
  )
}