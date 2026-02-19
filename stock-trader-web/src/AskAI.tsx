import React, { useRef, useState } from "react";
import axios from "axios";
import { Box, Button, CircularProgress, Typography, Stack, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";

interface AskAIProps {
  symbol: string;
  isMobile: boolean;
}

const AskAI: React.FC<AskAIProps> = ({ symbol, isMobile }) => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  React.useEffect(() => {
    // Abort any in-flight AI request when symbol changes
    abortControllerRef.current?.abort();
    setResponse(null);
    setError(null);
  }, [symbol]);

  const presetQuestions = [
    "Is the stock going up or down?",
    "Is this a stable stock?"
  ];

  const handleButtonClick = (question: string) => {
    setPendingQuestion(question);
  };

  const handleConfirm = () => {
    if (pendingQuestion) handleAsk(pendingQuestion);
    setPendingQuestion(null);
  };

  const handleCancel = () => {
    setPendingQuestion(null);
  };

  const handleAsk = async (question: string) => {
    // Abort previous request if still running
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

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
        { timeout: 60000, signal: controller.signal }
      );
      setResponse(res.data.response || "No answer returned.");
    } catch (err: any) {
      if (axios.isCancel(err)) return;
      setError(err.response?.data?.error || err.message || "Error occurred");
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  };

  return (
    <Box sx={{
      width: '100%',
      borderTop: '1px solid #2C2C2E',
      pt: 2,
      px: isMobile ? 1.5 : 3,
      boxSizing: 'border-box',
    }}>
      <Typography variant="subtitle2" sx={{ color: '#9E9E9E', mb: 1.5, fontWeight: 500, letterSpacing: '0.03em' }}>
        AI Insights &mdash; {symbol}
      </Typography>
      <Stack
        direction={isMobile ? 'column' : 'row'}
        spacing={1}
        justifyContent="flex-start"
      >
        {presetQuestions.map((q) => (
          <Button
            key={q}
            variant="outlined"
            onClick={() => handleButtonClick(q)}
            disabled={loading}
            fullWidth={isMobile}
            sx={{
              borderColor: '#2C2C2E',
              color: '#9E9E9E',
              textTransform: 'none',
              borderRadius: '20px',
              fontSize: '0.75rem',
              px: 2,
              py: 0.75,
              '&:hover': {
                borderColor: '#00C805',
                color: '#00C805',
                backgroundColor: 'rgba(0,200,5,0.05)',
              },
            }}
          >
            {q}
          </Button>
        ))}
        {loading && <CircularProgress size={20} sx={{ alignSelf: 'center' }} />}
      </Stack>
      {loading && (
        <Typography variant="body2" mt={1.5} sx={{ color: '#9E9E9E' }}>
          Analyzing data for {symbol}...
        </Typography>
      )}
      {response && (
        <Box sx={{ mt: 2, p: 2, bgcolor: '#1C1C1E', borderRadius: 2, border: '1px solid #2C2C2E' }}>
          <Typography variant="body2" sx={{ color: '#E0E0E0', lineHeight: 1.6 }}>
            {response}
          </Typography>
        </Box>
      )}
      {error && (
        <Typography variant="body2" mt={1.5} color="error">{error}</Typography>
      )}

      <Dialog
        open={!!pendingQuestion}
        onClose={handleCancel}
        PaperProps={{
          sx: {
            bgcolor: '#1C1C1E',
            border: '1px solid #2C2C2E',
            borderRadius: 2,
            color: '#FFFFFF',
          }
        }}
      >
        <DialogTitle sx={{ color: '#FFFFFF', fontWeight: 600 }}>Model Not in Memory</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#9E9E9E' }}>
            This model is not loaded into memory so this may take a while. Continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCancel} sx={{ color: '#9E9E9E', textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            sx={{
              bgcolor: '#00C805',
              color: '#000000',
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '20px',
              '&:hover': { bgcolor: '#00a804' },
            }}
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AskAI;
