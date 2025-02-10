const db = require("../config/firebase");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

console.log("✅ Checking Firestore connection in UserController...");
console.log("✅ DB Object Type:", typeof db);
console.log("✅ Firestore Function Available:", typeof db.collection);

exports.registerUser = async (req, res) => {
    const { email, name, password } = req.body;
    try {
        if (!email || !name || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Hash password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user document in Firestore
        const userRef = db.collection("users").doc();
        await userRef.set({
            email,
            name,
            password: hashedPassword,  // 🔥 This ensures password is stored
            createdAt: new Date().toISOString()
        });

        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Query Firestore for user
        const usersRef = db.collection("users");
        const snapshot = await usersRef.where("email", "==", email).get();

        if (snapshot.empty) {
            return res.status(400).json({ error: "User not found" });
        }

        let userData;
        snapshot.forEach(doc => {
            userData = doc.data();
        });

        console.log("Fetched User Data:", userData); // Log user data for debugging

        // Ensure password exists before comparing
        if (!userData.password) {
            return res.status(500).json({ error: "Password field is missing in database" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, userData.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { email: userData.email }, // Payload
            "your_jwt_secret", // Secret Key (Change this later)
            { expiresIn: "1h" } // Token expiry
        );

        res.json({ message: "Login successful!", token });
    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({ error: error.message });
    }
};