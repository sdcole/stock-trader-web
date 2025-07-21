import './App.css'
import StockChart from './StockChart';
import AskAI from './AskAI';
import CompanyDataGrid from './CompanyDataGrid';
import { useState, useEffect } from "react";
import { ThemeProvider, Container } from "@mui/material";
import theme from './theme';
import PopupOnLoad from './PopupOnLoad';

function App() {

  const [selectedSymbol, setSelectedSymbol] = useState("AAPL")
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      // If the window width is less than 600px, it's considered mobile
      setIsMobile(window.innerWidth <= 800);
    };

    // Check on mount
    checkMobile();

    // Add resize event listener to update on screen resize
    window.addEventListener("resize", checkMobile);

    // Clean up the event listener
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Container
      maxWidth="md"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // Center vertically in the viewport
        flexDirection: "column",
        textAlign: "center", // Center the text inside the components
      }}
    >
      <h1>Stock Monitor</h1>

      <StockChart
      symbol={selectedSymbol}
      isMobile={isMobile}
      />
      <AskAI symbol={selectedSymbol} />
      <CompanyDataGrid
      setSelectedSymbol={setSelectedSymbol}
      isMobile={isMobile}
      />
      

      <PopupOnLoad/>
      </Container>
    </ThemeProvider>
  )
}

export default App
