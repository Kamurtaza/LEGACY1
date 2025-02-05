require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");


const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import Routes
const userRoutes = require("./routes/userRoutes");
const storyRoutes = require("./routes/storyRoutes");

// Use Routes
app.use("/api/users", userRoutes);
app.use("/api/stories", storyRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
