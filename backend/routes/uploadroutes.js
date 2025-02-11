const express = require("express");
const { uploadAudio, getUserAudio, deleteAudio } = require("../controllers/UploadController");
const authenticateUser = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/upload-audio", authenticateUser, uploadAudio); // ✅ Upload file route
router.get("/user-audio", authenticateUser, getUserAudio); // ✅ Retrieve uploaded audio files
router.delete("/delete-audio/:audioId", authenticateUser, deleteAudio); // ✅ DELETE audio file

module.exports = router;
