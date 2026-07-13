import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors"
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(morgan("dev"));


import authRoutes from "./routes/auth.routes.js";


app.use("/api/auth",authRoutes);


export default app;