const { errorMonitor } = require("events");
const { db, bucket } = require("../config/firebase");
const multer = require("multer");
const path = require("path");

// Configure multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("audio"); // "audio" is the field name in Postman

// Upload an audio file to Firebase Storage and Firestore
exports.uploadAudio = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: "Error uploading file." });
        }

        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded." });
        }

        try {
            const userId = req.user.email; // Extract from JWT
            const fileName = `audio/${Date.now()}${path.extname(req.file.originalname)}`;
            const file = bucket.file(fileName);

            console.log("🔍 Uploading file:", fileName);

            // Create a writable stream
            const stream = file.createWriteStream({
                metadata: {
                    contentType: req.file.mimetype
                }
            });

            stream.on("error", (error) => {
                console.error("❌ Upload Error:", error);
                return res.status(500).json({ error: "Failed to upload file." });
            });

            stream.on("finish", async () => {
                // Make the file publicly accessible
                await file.makePublic();

                // Construct the file URL
                const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

                // Store file metadata in Firestore
                const audioRef = db.collection("recordings").doc();
                await audioRef.set({
                    userId,
                    fileName,
                    mediaUrl: publicUrl,
                    createdAt: new Date().toISOString()
                });

                res.status(200).json({ message: "File uploaded successfully!", mediaUrl: publicUrl });
            });

            // Write file buffer to storage
            stream.end(req.file.buffer);
        } catch (error) {
            console.error("❌ Upload Error:", error);
            res.status(500).json({ error: error.message });
        }
    });
};

//Retrieve all uploaded audio files for the logged in user
exports.getUserAudio = async (req, res) => {
    const userId = req.user.email; // Extract from JWT

    try {
        const snapshot = await db.collection("recordings").where("userId", "==", userId).get();

        if (snapshot.empty) {
            return res.json({ message: "No audio files found." });
        }
        const audioFiles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(audioFiles);
    } catch (error) {
        console.error("❌ Error Fetching Audio Files:", error);
        res.status(500).json({ error: error.message });  
    }
};

// Delete an audio file

exports.deleteAudio = async (req, res) => {
    const { audioId } = req.params;
    const userId = req.user.email;

    try {
        // Fetch the audio file from Firestore
        const audioRef = db.collection("recordings").doc(audioId); // ✅ Fixed collection name
        const audioDoc = await audioRef.get();

        if (!audioDoc.exists) {
            return res.status(404).json({ error: "Audio file not found" });
        }

        const audioData = audioDoc.data();
        
        // Check if the user owns the file
        if (audioData.userId !== userId) {
            return res.status(403).json({ error: "Unauthorized to delete this file" });
        }

        // Delete the file from Firebase Storage
        const file = bucket.file(audioData.fileName);
        await file.delete();

        // Remove from Firestore
        await audioRef.delete();

        res.json({ message: "Audio file deleted successfully!" });
    } catch (error) {
        console.error("Delete Audio Error:", error);
        res.status(500).json({ error: error.message });
    }
};