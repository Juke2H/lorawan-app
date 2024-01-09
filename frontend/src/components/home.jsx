import '/src/App.css'
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  function handleClick() {
    navigate("/test");
  }

  return (
    <div className="nodes">
      <h1>Lorawan Anturit</h1>
        <button className='button' onClick={handleClick}>
          Sisälämpöanturi
        </button>
        <button className='button'>
          Ulkolämpöanturi
        </button>
      </div>
  )
}