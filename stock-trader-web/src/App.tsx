import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import StockChart from './StockChart';

function App() {
  const [count, setCount] = useState(0)




  return (
    <>
      <div>
      </div>
      <h1>Stock Monitor</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      <StockChart/>
    </>
  )
}

export default App
