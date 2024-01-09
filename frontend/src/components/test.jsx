import '/src/App.css'
import { useNavigate } from "react-router-dom";

export default function Test() {
  const navigate = useNavigate();

  function handleClick() {
    navigate("/");
 }

  return (
    <div className="nodes">
      <h1>Lorawan Anturit</h1>
      <button className='button' onClick={handleClick}>
          Homepage
        </button>
      </div>
  )
}