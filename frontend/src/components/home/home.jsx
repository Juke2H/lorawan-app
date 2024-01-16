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

  return (
    <div className="nodes">
      <h1>Lorawan Anturit</h1>
        <button className='button' onClick={goDayPickerInside}>
          Sisälämpöanturi
        </button>
        <button className='button' onClick={goDayPickerOutside}>
          Ulkolämpöanturi
        </button>
      </div>
  )
}