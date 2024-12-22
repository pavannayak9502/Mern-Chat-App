const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
dotenv.config();
const userRoutes = require("./routes/userRoutes.js"); //Using for routes(login, register).
const { notFound, errorHandler } = require("./Middleware/errorMiddleware.js");
const chatRoutes = require("./routes/chatRoutes.js");
const messageRoutes = require("./routes/messageRoutes.js");
const path = require("path");

connectDB(); //Calling mongodb server for connecting to the database.
const app = express();
app.use(express.json()); //We are telling to our server to accept the json data.

//Instead of using get & post method we are using (use method it's an combination of both get and post method) in routes.
app.use("/api/user", userRoutes); //Login and registration route.

app.use("/api/chat", chatRoutes); //Chats routes.

app.use("/api/message", messageRoutes); //Users messages routes.

// -------------------------Deployment----------------------------

const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is Running successfully");
  });
}

//--------------------------Deployment----------------------------

//For incorrect url entered by user, if any error occur use errorHandler function.
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  //We are assigning the variable to app.listen. (Actually we are using for socket.io for real-time communication)
  console.log("Server Port : ", port);
});

//This variable(io) now holds the instance of the Socket.IO server that can handle WebSocket connections and emit events to clients.
const io = require("socket.io")(server, {
  //First we are importing the socket.io package for real-time communications. The server variable(line: 27) represents an existing HTTP server that you pass to the socket.io instance to allow it to listen for WebSocket connections on that server.
  pingTimeout: 60000, //If user didn't send any messages or something happens then pingTimeout will close the connection to save the bandwidth.
  cors: {
    //cors means Cross-Origin Resource Sharing, and it's used to control which domains are allowed to interact with your Socket.IO server.
    origin: "http://localhost:3000", //The origin setting specifies the allowed origin (in this case, http://localhost:3000), which is the client’s URL. By specifying this, you're allowing only requests from this specific origin to connect to the Socket.IO server. Important: Without this CORS setting, browsers might block the connection due to security restrictions that prevent cross-origin requests unless explicitly allowed.
  },
});

//We are creating the connection and then a callback function.
io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    //This socket.on function will take user data from the frontend.
    socket.join(userData._id); //We are creating a new room with the id of the userData for that particular user. And that room will be exculsive for that particular user ony.
    console.log("User Logged in : " + userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    //When we click on the user it will create an new room(sender) and when that particular join's the chat then our socket will throw him into this room for chating(1:1 chat).
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  //Showing typing indicator for users in the room that something typing in the chat.
  socket.on("typing", (room) => socket.in(room).emit("typing"));

  //Showing typing indicator for users in the room that something stopped typing during sending the chat in that room.
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  //Showing that user for new message recieved.
  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) {
      return console.log("chat.users not defined ");
    }

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) {
        return;
      }

      socket.in(user._id).emit("message recieved", newMessageRecieved); //socket.in (in) means inside that user's room emit/send that message.
    });
  });

  //If user leaves then display backend server that user disconnected. Using this feature we can save our bandwidth. If we are not using this feature then it gone take more bandwidth.
  socket.off("setup", () => {
    console.log("User Disconnected: " + userData._id);
    socket.leave(userData._id); //If user leave from room then remove that user from that room to save the bandwidth.
  });
});
