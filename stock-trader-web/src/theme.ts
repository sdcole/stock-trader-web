import { createTheme } from "@mui/material/styles";

/*
  Robinhood-inspired design tokens
  BG:          #0D0D0D (near-black)
  Surface:     #1C1C1E (cards)
  Border:      #2C2C2E (subtle dividers)
  Input BG:    #2C2C2E
  Green:       #00C805 (gains / primary accent)
  Red:         #FF5252 (losses / errors)
  Text:        #FFFFFF (primary), #9E9E9E (secondary/muted)
*/

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00C805",
    },
    secondary: {
      main: "#FF5000",
    },
    error: {
      main: "#FF5252",
    },
    background: {
      default: "#0D0D0D",
      paper: "#1C1C1E",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#9E9E9E",
    },
    divider: "#2C2C2E",
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    h4: {
      fontWeight: 700,
      fontSize: "2rem",
      letterSpacing: "-0.02em",
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.5rem",
      letterSpacing: "-0.01em",
    },
    h6: {
      fontWeight: 600,
      fontSize: "1.25rem",
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: "0.875rem",
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: "0.75rem",
      color: "#9E9E9E",
    },
    body1: {
      fontSize: "0.9375rem",
    },
    body2: {
      fontSize: "0.8125rem",
      color: "#9E9E9E",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#1C1C1E",
          borderRadius: 12,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          textTransform: "none" as const,
          fontWeight: 600,
          fontSize: "0.8125rem",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none" as const,
          fontWeight: 600,
          fontSize: "0.875rem",
          color: "#9E9E9E",
          "&.Mui-selected": {
            color: "#00C805",
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: "#00C805",
          height: 2,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: "#2C2C2E",
          "& fieldset": {
            borderColor: "#3A3A3C",
          },
          "&:hover fieldset": {
            borderColor: "#4A4A4C",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#00C805",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#9E9E9E",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: "#1C1C1E",
          borderRadius: 16,
          border: "1px solid #2C2C2E",
        },
      },
    },
    MuiCircularProgress: {
      defaultProps: {
        color: "primary" as const,
      },
    },
  },
});

export default theme;
