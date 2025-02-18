import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4CAF50", // Change this to match your app’s brand
    },
    secondary: {
      main: "#FF9800",
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
  },
});

export default theme;
