const admin = require("firebase-admin");
const serviceAccount = require("./firebaseConfig.json"); // Ensure this file exists

// ✅ Initialize Firebase Admin SDK (Firestore + Storage)
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "legacyapp-f8b73.firebasestorage.app", // ✅ Ensure this matches Firebase Console!
    databaseURL: "https://legacyapp-f8b73.firebaseio.com"
});

// ✅ Firestore setup
const db = admin.firestore();
const bucket = admin.storage().bucket(); // ✅ This now correctly points to your bucket

console.log("🔥 Firebase initialized successfully!");
console.log("✅ Firestore Object Type:", typeof db);
console.log("✅ Firestore Available Functions:", Object.keys(db));

module.exports = { db, bucket };
