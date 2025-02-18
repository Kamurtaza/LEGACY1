import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Typography, Paper, Box } from "@mui/material";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Welcome to Your Dashboard
        </Typography>
        <Typography variant="body1">Here you can manage your stories.</Typography>
        <Button variant="contained" color="error" fullWidth sx={{ mt: 2 }} onClick={handleLogout}>
          Logout
        </Button>
      </Paper>
    </Container>
  );
}

export default Dashboard;
