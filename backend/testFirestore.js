const { db } = require("./config/firebase");

async function testFirestore() {
    try {
        console.log("Testing Firestore connection...");
        console.log("✅ DB Object Type:", typeof db);
        console.log("✅ Firestore Function Available:", typeof db.collection);

        // Try reading from Firestore
        const snapshot = await db.collection("test").get();
        console.log("✅ Firestore is working! Docs found:", snapshot.size);
    } catch (error) {
        console.error("❌ Firestore Error:", error.message);
    }
}

testFirestore();
