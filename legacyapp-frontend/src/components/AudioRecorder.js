import React, { useState, useRef } from "react";
import { Container, Paper, Typography, Box, Button } from "@mui/material";
import axios from "axios";

const AudioRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Start recording audio using MediaRecorder API
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = event => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/mp3" });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  // Stop recording
  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  // Upload recorded audio to the backend
  const uploadRecording = async () => {
    if (!audioBlob) {
      alert("No recording available!");
      return;
    }
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.mp3");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/upload/upload-audio",
        formData,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Upload successful!");
      console.log("Uploaded file URL:", response.data.mediaUrl);
      // Optionally, clear the recording or update a list of files.
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed!");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Audio Recorder
        </Typography>
        <Box sx={{ mt: 2 }}>
          {recording ? (
            <Button variant="contained" color="error" onClick={stopRecording}>
              Stop Recording
            </Button>
          ) : (
            <Button variant="contained" onClick={startRecording}>
              Start Recording
            </Button>
          )}
        </Box>
        {audioURL && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Preview:</Typography>
            <audio src={audioURL} controls />
          </Box>
        )}
        {audioBlob && (
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" color="primary" onClick={uploadRecording}>
              Upload Recording
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default AudioRecorder;
