// express app
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

// dotenv
dotenv.config();

//Connecting to MongoDB
connectDB();

// middleware
// to accept JSON content from requests
app.use(express.json());

// user router
// all routes with path /api/users will be handled by userRoutes
app.use("/api/user", userRoutes);

// chat router
// all routes with path /api/chat will be handled by chatRoutes
app.use("/api/chat", chatRoutes);

// message router
// all routes with path /api/message will be handled by messageRoutes
app.use("/api/message", messageRoutes);

app.listen(PORT, () => {
  console.log("Server is up on", PORT);
});
