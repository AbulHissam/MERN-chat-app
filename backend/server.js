// express app
const express = require("express");
const path = require("path");
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

// ------------------Deployment---------------
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Api running successfully");
  });
}
// ------------------Deployment---------------

const server = app.listen(PORT, () => {
  console.log("Server is up on", PORT);
});

const { Server } = require("socket.io");
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");

  // handle setup event emitted from client // refer SingleChat.js in frontend
  socket.on("setup", (userData) => {
    // join a room with unique id (user id)
    socket.join(userData._id);
    // after joining the room emit connected event to client
    socket.emit("connected");
  });

  // handle typing
  // handle "join chat" event emmited from client
  socket.on("join chat", (room) => {
    // join a room with unique id (room)
    socket.join(room);
    console.log(room);
  });
  // handle "typing" event emitted from client
  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });
  // handle "stop typing" event emitted from client
  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });

  // handle "new message" event emitted fron client
  socket.on("new message", (newMessageReceived) => {
    // console.log(newMessageReceived);

    // take the chat from newMessage
    let chat = newMessageReceived.chat;

    // if there are no users is chat return
    if (!chat.users) {
      return console.log(
        "users is not present in chat or chat.users is not defined"
      );
    }

    // emit the message to other users apart from sender
    chat.users.forEach((user) => {
      // if this condition is true he is the sender and we should not emit message to him
      if (user._id === newMessageReceived.sender._id) return;

      // emit the message to other users
      //socket.in(user._id) finds the room where the user is present.
      // we have created a room with user._id as the unique room id
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });
});
