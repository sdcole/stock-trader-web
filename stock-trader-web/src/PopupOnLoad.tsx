import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

function PopupOnLoad() {
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    setOpen(true); // Opens the dialog on page load
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Welcome To Stock Monitor!</DialogTitle>
      <DialogContent>
        <Typography>Thanks for visiting our site. This site tracks common NYSE stock prices</Typography>
        <Typography>NOTE: This site contains no financial advice and is not liable for any losses or gains in the market.</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
}
export default PopupOnLoad