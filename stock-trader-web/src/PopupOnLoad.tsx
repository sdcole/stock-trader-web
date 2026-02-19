import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

function PopupOnLoad() {
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle sx={{ fontWeight: 600, color: '#FFFFFF' }}>
        Welcome to Stock Monitor
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ color: '#9E9E9E', mb: 1 }}>
          Track common NYSE stock prices with real-time data and AI-powered insights.
        </Typography>
        <Typography variant="body2" sx={{ color: '#9E9E9E' }}>
          This site contains no financial advice and is not liable for any losses or gains in the market.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          sx={{
            color: '#00C805',
            borderRadius: '20px',
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': { backgroundColor: 'rgba(0,200,5,0.08)' },
          }}
        >
          Got it
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default PopupOnLoad;
