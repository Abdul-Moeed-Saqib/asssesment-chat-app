const express = require('express');
const dotenv = require("dotenv");
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require('./middleware/error');
const path = require('path');

dotenv.config();
connectDB();

const app = express();

app.use(express.json()); // to accept JSON data

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

// Deployment

const _dirname1 = path.resolve();
if (process.env.NODE_ENV == 'production') {
    app.use(express.static(path.join(_dirname1, '/frontend/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(_dirname1, "frontend", "build", "index.html"));
    })
} 

// Deployment

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server Started on PORT ${PORT}`));

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000"
    }
});

io.on("connection", (socket) => {
    console.log("Server is connected to socket.io");

    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room)
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (recievedMessage) => {
        let chat = recievedMessage.chat;

        if (!chat.users) {
            return console.log("Chat.users not defined");
        }

        chat.users.forEach(user => {
            if (user._id === recievedMessage.sender._Id) {
                return;
            }

            socket.in(user._id).emit("message recieved", recievedMessage);
        })
    });

    socket.off("setup", () => {
        console.log("User Disconnected!")
        socket.leave(userData._id);
    });
});