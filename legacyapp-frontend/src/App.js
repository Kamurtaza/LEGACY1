import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline, AppBar, Toolbar, Typography, Container, Button } from "@mui/material";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Legacy Creator App
          </Typography>
          <Button color="inherit" href="/">
            Login
          </Button>
          <Button color="inherit" href="/register">
            Register
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
