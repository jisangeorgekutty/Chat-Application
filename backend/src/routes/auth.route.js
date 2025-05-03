import express from "express"
import { logIn, logOut, signUp, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { checkAuth } from "../controllers/auth.controller.js";

const router=express.Router();

router.post("/signup",signUp);

router.post("/login",logIn);

router.post("/logout",logOut);

router.put("/update-profile",protectRoute,updateProfile);
// route called first check protectRoute method
// protectRoute is middleware to check the user is logged in by using

router.get("/check",protectRoute,checkAuth);
// check route to check the user is logged in or not

export default router; 
