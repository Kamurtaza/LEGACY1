const { bucket } = require("../config/firebase");
const multer = require("multer");
const path = require("path");

// Configure Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("audio"); // "audio" is the form field name

// Upload audio to Firebase Storage
exports.uploadAudio = async (req, res) => {
    console.log("🔍 Checking request...");

    upload(req, res, async (err) => {
        if (err) {
            console.error("❌ Multer Upload Error:", err);
            return res.status(400).json({ error: "Error uploading file." });
        }

        if (!req.file) {
            console.error("❌ No file received.");
            return res.status(400).json({ error: "No file uploaded." });
        }

        console.log("🔍 File received:", {
            fieldname: req.file.fieldname,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size
        });

        try {
            const fileName = `audio/${Date.now()}${path.extname(req.file.originalname)}`;
            const file = bucket.file(fileName);

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
                await file.makePublic();
                const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
                console.log("✅ File uploaded successfully!", publicUrl);
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
