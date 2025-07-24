import './App.css'
import StockChart from './StockChart';
import AskAI from './AskAI';
import CompanyDataGrid from './CompanyDataGrid';
import { useState } from "react";
import { ThemeProvider, Container, Box, Paper, useMediaQuery } from "@mui/material";
import theme from './theme';
import PopupOnLoad from './PopupOnLoad';


function App() {
  const isMobile = useMediaQuery('(max-width:800px)');
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL");

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ py: isMobile ? 1 : 4 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? 2 : 4,
            alignItems: 'flex-start',
            justifyContent: 'center',
            minHeight: '100vh',
          }}
        >
          {/* Company List */}
          <Box
            sx={{
              overflow: 'visible',
              maxHeight: isMobile ? 400 : 600,
              width: isMobile ? '100%' : 350,
              maxWidth: isMobile ? '100%' : 350,
              minWidth: 0,
              flexShrink: 0,
              mr: isMobile ? 0 : 4,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Paper elevation={2} sx={{ p: isMobile ? 1 : 2.5, borderRadius: 3, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', overflow: 'hidden' }}>
              <CompanyDataGrid setSelectedSymbol={setSelectedSymbol} isMobile={isMobile} selectedSymbol={selectedSymbol} />
            </Paper>
          </Box>
          {/* Chart and Ask AI */}
          <Box flex={2} minWidth={0} sx={{
            width: isMobile ? '100%' : 0,
            maxWidth: isMobile ? '100%' : 'calc(100vw - 350px - 64px)',
            minWidth: 0,
            overflowX: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <Paper elevation={2} sx={{
              p: isMobile ? 1 : 2.5,
              mb: isMobile ? 2 : 0,
              overflow: 'hidden',
              minWidth: 0,
              width: '100%',
              maxWidth: '100%',
              borderRadius: 3,
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
            }}>
              <Box sx={{
                overflow: 'auto',
                maxHeight: isMobile ? 600 : 900,
                width: '100%',
                maxWidth: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                boxSizing: 'border-box',
              }}>
                <Box sx={{ flex: 1, width: '100%', minWidth: 0, maxWidth: '100%', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <StockChart symbol={selectedSymbol} isMobile={isMobile} />
                </Box>
                <Box sx={{ flex: 1, width: '100%', minWidth: 0, maxWidth: '100%', mt: 2, overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <AskAI symbol={selectedSymbol} />
                </Box>
              </Box>
            </Paper>
            <PopupOnLoad />
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  )
}

export default App
