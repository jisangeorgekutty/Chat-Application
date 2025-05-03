import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import mongoose from "mongoose";
import { getReceiverSocketId, io } from "../lib/socket.js";


export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedUserId } }).select("-password");
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error in the getUsersForSidebar", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getMessage = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const userToChatObjectId = new mongoose.Types.ObjectId(userToChatId);

        // Match field names with sendMessage
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatObjectId },
                { senderId: userToChatObjectId, receiverId: myId }
            ]
        }).sort({ createdAt: "asc" });

        // console.log("BACKEND MESSAGE:", messages);
        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in the getMessage:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const sendMessage = async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const senderId = req.user._id;
        const { text, image } = req.body;
        let imageUrl;

        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });

        await newMessage.save();

        const receiverSocketId=getReceiverSocketId(receiverId);
        if(receiverId){
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }
        
        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in the sendMessage", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}