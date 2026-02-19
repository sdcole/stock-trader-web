import './App.css'
import { CssBaseline } from "@mui/material";
import StockChart from './StockChart';
import AskAI from './AskAI';
import CompanyDataGrid from './CompanyDataGrid';
import { useState } from "react";
import { ThemeProvider, Container, Box, Tab, Tabs, useMediaQuery } from "@mui/material";
import theme from './theme';
import PopupOnLoad from './PopupOnLoad';


function App() {
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL");
  const [mobileTab, setMobileTab] = useState(1);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: isMobile ? 1 : 4, px: isMobile ? 1.5 : 4 }}>
        {isMobile ? (
          <Box sx={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Tabs
              value={mobileTab}
              onChange={(_, v) => setMobileTab(v)}
              variant="fullWidth"
              sx={{ mb: 1, borderBottom: '1px solid #2C2C2E' }}
            >
              <Tab label="Watchlist" />
              <Tab label="Chart" />
            </Tabs>

            {mobileTab === 0 && (
              <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                <CompanyDataGrid
                  setSelectedSymbol={(sym: string) => {
                    setSelectedSymbol(sym);
                    setMobileTab(1);
                  }}
                  isMobile={isMobile}
                  selectedSymbol={selectedSymbol}
                />
              </Box>
            )}

            {mobileTab === 1 && (
              <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                <StockChart symbol={selectedSymbol} isMobile={isMobile} />
                <AskAI symbol={selectedSymbol} isMobile={isMobile} />
              </Box>
            )}

            <PopupOnLoad />
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: 3,
              alignItems: 'flex-start',
              minHeight: '100vh',
              pt: 2,
            }}
          >
            <Box
              sx={{
                width: 360,
                maxWidth: 360,
                flexShrink: 0,
                position: 'sticky',
                top: 32,
                display: 'flex',
                flexDirection: 'column',
                maxHeight: 'calc(100vh - 64px)',
              }}
            >
              <CompanyDataGrid setSelectedSymbol={setSelectedSymbol} isMobile={isMobile} selectedSymbol={selectedSymbol} />
            </Box>

            <Box sx={{
              flex: 2,
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
            }}>
              <StockChart symbol={selectedSymbol} isMobile={isMobile} />
              <AskAI symbol={selectedSymbol} isMobile={isMobile} />
              <PopupOnLoad />
            </Box>
          </Box>
        )}
      </Container>
    </ThemeProvider>
  )
}

export default App
