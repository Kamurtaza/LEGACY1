import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography, Box, Paper } from "@mui/material";

function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/users/register", { email, name, password });
      alert("Registration successful! Please login.");
      navigate("/");
    } catch (error) {
      alert("Error registering user");
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Register
        </Typography>
        <form onSubmit={handleRegister}>
          <TextField fullWidth label="Name" variant="outlined" margin="normal" value={name} onChange={(e) => setName(e.target.value)} required />
          <TextField fullWidth label="Email" variant="outlined" margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <TextField fullWidth label="Password" type="password" variant="outlined" margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Register
          </Button>
        </form>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Already have an account? <a href="/">Login</a>
        </Typography>
      </Paper>
    </Container>
  );
}

export default Register;
