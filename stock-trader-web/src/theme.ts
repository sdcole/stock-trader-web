import { createTheme } from "@mui/material/styles";
/*
COLORS
BG - 333333
Secondary BG - 5E5E5E
Accent - 48E5C2
White - FCFAF9
Red - DA2C38



*/
const theme = createTheme({
  palette: {
    primary: {
      main: "#48E5C2", // Blue
    },
    secondary: {
      main: "#dc004e", // Pinkish-red
    },
    background: {
      default: "#333333", // Light gray background
      paper: "#333333", // White paper background
    },
    text: {
      primary: "#FCFAF9", // Dark text
      secondary: "#FCFAF9", // Lighter text
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Rounded buttons
        },
      },
    },
    

  
  },
});

export default theme;
