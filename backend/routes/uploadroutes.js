const express = require("express");
const { uploadAudio } = require("../controllers/UploadController");
const authenticateUser = require("../middleware/authMiddleware"); // Ensures only authenticated users can upload

const router = express.Router();

router.post("/upload-audio", authenticateUser, uploadAudio); // Upload file route

module.exports = router;
