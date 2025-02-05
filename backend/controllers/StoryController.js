const db = require("../config/firebase");

// Create a new story
exports.createStory = async (req, res) => {
    const { title, content, mediaUrl } = req.body;
    const userId = req.user.email; // Extract user from JWT token

    try {
        const storyRef = db.collection("stories").doc();
        const newStory = {
            title,
            content,
            mediaUrl,
            userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        await storyRef.set(newStory);

        res.status(201).json({ message: "Story created successfully!", story: newStory });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all stories for a user
exports.getUserStories = async (req, res) => {
    const userId = req.user.email;
    try {
        const storiesSnapshot = await db.collection("stories").where("userId", "==", userId).get();
        const stories = storiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(stories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single story by ID
exports.getStoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const storyDoc = await db.collection("stories").doc(id).get();
        if (!storyDoc.exists) {
            return res.status(404).json({ error: "Story not found" });
        }
        res.json(storyDoc.data());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a story
exports.updateStory = async (req, res) => {
    const { id } = req.params;
    const { title, content, mediaUrl } = req.body;
    const userId = req.user.email;

    try {
        const storyRef = db.collection("stories").doc(id);
        const storyDoc = await storyRef.get();

        if (!storyDoc.exists) {
            return res.status(404).json({ error: "Story not found" });
        }

        if (storyDoc.data().userId !== userId) {
            return res.status(403).json({ error: "Unauthorized to update this story" });
        }

        const updatedStory = {
            title,
            content,
            mediaUrl,
            updatedAt: new Date().toISOString()
        };

        await storyRef.update(updatedStory);
        res.json({ message: "Story updated successfully!", updatedStory });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a story
exports.deleteStory = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.email;

    try {
        const storyRef = db.collection("stories").doc(id);
        const storyDoc = await storyRef.get();

        if (!storyDoc.exists) {
            return res.status(404).json({ error: "Story not found" });
        }

        if (storyDoc.data().userId !== userId) {
            return res.status(403).json({ error: "Unauthorized to delete this story" });
        }

        await storyRef.delete();
        res.json({ message: "Story deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
