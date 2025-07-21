import React, { useState } from "react";
import { Box, Button, CircularProgress, Typography, Paper, Stack } from "@mui/material";

interface AskAIProps {
  symbol: string;
}

const AskAI: React.FC<AskAIProps> = ({ symbol }) => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const presetQuestions = [
    "Is the stock going up or down?",
    "Is this a stable stock?"
  ];

  const handleAsk = async (question: string) => {
    setLoading(true);
    setResponse(null);
    setError(null);
    try {
      const res = await fetch("/api/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol, question }),
      });
      if (!res.ok) throw new Error("Failed to get response");
      const data = await res.json();
      setResponse(data.answer || "No answer returned.");
    } catch (err: any) {
      setError(err.message || "Error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box mt={3} mb={2}>
      <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
        <Typography variant="subtitle1" mb={2}>
          Ask AI about <b>{symbol}</b>:
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
          {presetQuestions.map((q) => (
            <Button
              key={q}
              variant="contained"
              onClick={() => handleAsk(q)}
              disabled={loading}
            >
              {q}
            </Button>
          ))}
          {loading && <CircularProgress size={24} sx={{ alignSelf: 'center' }} />}
        </Stack>
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
