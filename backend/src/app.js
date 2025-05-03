import express from "express"
import authRoutes from "./routes/auth.route.js"
import dotenv from "dotenv"
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import messageRoutes from "./routes/message.route.js";
import cors from "cors";
import {app,server} from "./lib/socket.js"

dotenv.config();

const PORT=process.env.PORT;
 
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({credentials:true,origin:"http://localhost:5173"}));   

app.use("/api/auth",authRoutes);
app.use("/api/message",messageRoutes);



server.listen(PORT,()=>{
    console.log("Server Runnng On Port:"+PORT);
    connectDB();
});