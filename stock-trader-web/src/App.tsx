import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import StockChart from './StockChart';
import CompanyDataGrid from './CompanyDataGrid';
import React, { useEffect, useState } from "react";
import axios from "axios";
import { LineChart } from "@mui/x-charts/LineChart";
import { TextField, Button, Box, Typography, Paper, ThemeProvider } from "@mui/material";
import theme from './theme';

function App() {
  const [count, setCount] = useState(0)

  const [selectedTicker, setSelectedTicker] = useState("AAPL")



  return (
    <ThemeProvider theme={theme}>
      <div>
      </div>
      <h1>Stock Monitor</h1>
      <CompanyDataGrid
      setSelectedTicker={setSelectedTicker}/>
      <StockChart
      ticker={selectedTicker}/>
    </ThemeProvider>
  )
}

export default App
