import React, { useState } from "react";
import axios from "axios";
import { Box, Button, CircularProgress, Typography, Paper, Stack } from "@mui/material";

interface AskAIProps {
  symbol: string;
}

const AskAI: React.FC<AskAIProps> = ({ symbol }) => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Clear response and error when symbol changes
  React.useEffect(() => {
    setResponse(null);
    setError(null);
  }, [symbol]);

  const presetQuestions = [
    "Is the stock going up or down?",
    "Is this a stable stock?"
  ];

  const handleAsk = async (question: string) => {
    setLoading(true);
    setResponse(null);
    setError(null);
    try {
      const res = await axios.post(
        "https://trade.meshservice.work/api/trade/v1/ask-ai",
        {
          Symbol: symbol,
          RequestType: question
        },
        { timeout: 60000 } // 60 seconds timeout
      );
      setResponse(res.data.response || "No answer returned.");
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box mt={3} mb={2} sx={{ width: '100%' }}>
      <Paper elevation={2} sx={{
        p: { xs: 1, sm: 2 },
        borderRadius: 2,
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'visible',
        maxHeight: 'none',
        minHeight: 0,
      }}>
        <Typography variant="subtitle1" mb={2} sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
          Ask AI about <b>{symbol}</b>:
        </Typography>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 1, sm: 2 }}
          justifyContent="center"
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          {presetQuestions.map((q) => (
            <Button
              key={q}
              variant="contained"
              onClick={() => handleAsk(q)}
              disabled={loading}
              fullWidth={true}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              {q}
            </Button>
          ))}
          {loading && <CircularProgress size={24} sx={{ alignSelf: 'center' }} />}
        </Stack>
        {loading && (
          <Typography mt={2} color="text.secondary">
            Analyzing all data for that symbol, this may take some time...
          </Typography>
        )}
        {response && (
          <Typography mt={2} color="primary">{response}</Typography>
        )}
        {error && (
          <Typography mt={2} color="error">{error}</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default AskAI;
