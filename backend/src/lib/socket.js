import { Server } from "socket.io";
import http from "http";
import express from "express"

const app = express();
const server = http.createServer(app);

// it create a socket server above the curret server for realtime communication
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"]
    }
});

const userSocketMap = {};          // userId:socketId- store online users

export function getReceiverSocketId(userId){
    return userSocketMap[userId];
}

io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    // get the connected user passed from frontend connectSocket 
    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;

    // io.emit broadcat to all the connected client
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { io, app, server };