const admin = require("firebase-admin");
const serviceAccount = require("./firebaseConfig.json"); // Ensure this is not shared publicly

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://legacyapp-f8b73.firebaseio.com" // Replace with your actual project URL
});

const db = admin.firestore();
module.exports = db;
