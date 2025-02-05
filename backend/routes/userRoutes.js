const express = require("express");
const { registerUser, loginUser } = require("../controllers/UserController");
const router = express.Router();
const authenticateUser = require("../middleware/authMiddleware");
const { auth } = require("firebase-admin");

router.post("/register", registerUser);
router.post("/login", loginUser);

// protected route (only accessible if logged in)
router.get("/me", authenticateUser, (req, res) => {
    res.json({ message: "Welcome!", user: req.user });
});

module.exports = router;
