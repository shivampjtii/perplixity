import express from "express";
import { getMeController, loginController, registerController, verifyEmailController } from "../controllers/auth.controller.js";
import { loginValidator, registerValidator } from "../validators/auth.validator.js";
import { authUser } from "../middlewares/auth.middleware.js";

const authRoutes = express.Router();


authRoutes.post("/register", registerValidator, registerController);
authRoutes.post("/login", loginValidator, loginController);
authRoutes.get("/verify-email", verifyEmailController);
authRoutes.get("/get-me", authUser, getMeController);



export default authRoutes;