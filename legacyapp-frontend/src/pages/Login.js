import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography, Box, Paper } from "@mui/material";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/users/login", { email, password });
      localStorage.setItem("token", response.data.token);
      alert("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      alert("Invalid credentials");
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField fullWidth label="Email" variant="outlined" margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <TextField fullWidth label="Password" type="password" variant="outlined" margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>
        </form>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Don't have an account? <a href="/register">Register</a>
        </Typography>
      </Paper>
    </Container>
  );
}

export default Login;
