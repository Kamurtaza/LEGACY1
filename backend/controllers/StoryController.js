const { db } = require("../config/firebase");  // ✅ Ensure correct destructuring!


// Create a new story
exports.createStory = async (req, res) => {
    const { title, content, mediaUrl } = req.body;
    const userId = req.user.email; // Extract user from JWT token

    console.log("🔍 Checking Firestore before creating a story...");
    console.log("✅ DB Object Type:", typeof db);
    console.log("✅ Firestore Function Available:", typeof db.collection);
    console.log("✅ Firestore Object Keys:", Object.keys(db));

    try {
        const storyRef = db.collection("stories").doc();  // 🔥 Fails here if db is incorrect!
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
        console.error("❌ Firestore Error:", error.message);
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
    const { storyId } = req.params;
    console.log("Requested Story ID:", storyId); // 🔥 Debugging Log

    try {
        const storyDoc = await db.collection("stories").doc(storyId).get();
        if (!storyDoc.exists) {
            console.log("Story not found in Firestore."); // 🔥 Debugging Log
            return res.status(404).json({ error: "Story not found" });
        }

        console.log("Fetched Story Data:", storyDoc.data()); // 🔥 Debugging Log
        res.json(storyDoc.data());
    } catch (error) {
        console.error("Error Fetching Story:", error.message); // 🔥 Debugging Log
        res.status(500).json({ error: error.message });
    }
};

// Update a story
exports.updateStory = async (req, res) => {
    const { storyId } = req.params;
    const { title, content, mediaUrl } = req.body;
    const userId = req.user.email;

    console.log("Story ID:", storyId); // Log storyId
    console.log("User ID from Token:", userId); // Log userId from token

    try {
        const storyRef = db.collection("stories").doc(storyId);
        const storyDoc = await storyRef.get();

        if (!storyDoc.exists) {
            console.log("Story not found in Firestore.");
            return res.status(404).json({ error: "Story not found" });
        }

        console.log("Story Owner ID:", storyDoc.data().userId); // Log owner of the story

        if (storyDoc.data().userId !== userId) {
            console.log("Unauthorized access attempt by:", userId);
            return res.status(403).json({ error: "Unauthorized to update this story" });
        }

        const updatedStory = {
            title,
            content,
            mediaUrl,
            updatedAt: new Date().toISOString(),
        };

        await storyRef.update(updatedStory);
        res.json({ message: "Story updated successfully!", updatedStory });
    } catch (error) {
        console.error("Error updating story:", error.message);
        res.status(500).json({ error: error.message });
    }
};

// Delete a story
exports.deleteStory = async (req, res) => {
    const { storyId } = req.params;
    const userId = req.user.email; // Extract user email from JWT token

    console.log("Story ID from Request:", storyId); // Debugging log
    console.log("User ID from Token:", userId); // Debugging log

    try {
        const storyRef = db.collection("stories").doc(storyId);
        const storyDoc = await storyRef.get();

        if (!storyDoc.exists) {
            console.log("Story not found in Firestore."); // Log if story doesn't exist
            return res.status(404).json({ error: "Story not found" });
        }

        if (storyDoc.data().userId !== userId) {
            console.log("Unauthorized access attempt by:", userId); // Log unauthorized access
            return res.status(403).json({ error: "Unauthorized to delete this story" });
        }

        await storyRef.delete();
        console.log("Story deleted successfully!"); // Log successful deletion
        res.json({ message: "Story deleted successfully!" });
    } catch (error) {
        console.error("Error deleting story:", error.message); // Log unexpected errors
        res.status(500).json({ error: error.message });
    }
};