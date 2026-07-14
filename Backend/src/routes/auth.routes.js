import express from "express";
import { registerController, verifyEmailController } from "../controllers/auth.controller.js";

const authRoutes = express.Router();


authRoutes.post("/register", registerController);
authRoutes.get("/verify-email", verifyEmailController);


export default authRoutes;