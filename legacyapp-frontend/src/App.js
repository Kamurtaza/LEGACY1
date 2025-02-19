import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AudioRecorder from "./components/AudioRecorder";

function App() {
  return (
    <Router>
      <div>
        <h1>Legacy Creator App</h1>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/record" element={<AudioRecorder />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
