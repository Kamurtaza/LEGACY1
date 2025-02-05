const express = require("express");
const {
    createStory,
    getUserStories,
    getStoryById,
    updateStory,
    deleteStory
} = require("../controllers/StoryController");

const authenticateUser = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticateUser, createStory); // Create a new story
router.get("/", authenticateUser, getUserStories); // Get all stories for a user
router.get("/:id", authenticateUser, getStoryById); // Get a single story
router.put("/:id", authenticateUser, updateStory); // Update a story
router.delete("/:id", authenticateUser, deleteStory); // Delete a story

module.exports = router;
