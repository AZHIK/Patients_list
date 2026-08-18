import './index.css'
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import App from "./App";

const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

const theme = createTheme({
  palette: {
    mode: isDark ? "dark" : "light",
    primary: {
      main: isDark ? "#60a5fa" : "#3b82f6",
    },
    background: {
      default: isDark ? "#111827" : "#ffffff",
      paper: isDark ? "#1f2937" : "#ffffff",
    },
    text: {
      primary: isDark ? "#d1d5db" : "#374151",
      secondary: isDark ? "#9ca3af" : "#6b7280",
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      '"Roboto"',
      '"Oxygen"',
      '"Ubuntu"',
      '"Cantarell"',
      '"Fira Sans"',
      '"Droid Sans"',
      '"Helvetica Neue"',
      "sans-serif",
    ].join(","),
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </BrowserRouter>
);
