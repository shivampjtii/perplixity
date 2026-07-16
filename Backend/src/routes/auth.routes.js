import express from "express";
import { loginController, registerController, verifyEmailController } from "../controllers/auth.controller.js";
import { loginValidator, registerValidator } from "../validators/auth.validator.js";

const authRoutes = express.Router();


authRoutes.post("/register", registerValidator, registerController);
authRoutes.post("/login", loginValidator, loginController);
authRoutes.get("/verify-email", verifyEmailController);



export default authRoutes;