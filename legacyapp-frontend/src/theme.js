import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#C89F77", // Gold
    },
    secondary: {
      main: "#6A4E23", // Brown
    },
    background: {
      default: "#FFFFFF", // White
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
  },
});

export default theme;
