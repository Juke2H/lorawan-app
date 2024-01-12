import '/src/App.css'
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  function goToTest() {
    navigate("/test");
  }
  function goToTest2() {
    navigate("/test2");
  }

  return (
    <div className="nodes">
      <h1>Lorawan Anturit</h1>
        <button className='button' onClick={goToTest}>
          Sisälämpöanturi
        </button>
        <button className='button' onClick={goToTest2}>
          Ulkolämpöanturi
        </button>
      </div>
  )
}