import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db";
import authRoutes from "./routes/authRoutes";
import projectRouter from "./routes/projectRouter";
import { corsConfig } from "./config/cors";
import morgan from "morgan";

dotenv.config();

connectDB();

const app = express();

app.use(cors(corsConfig));
// app.use(cors());

// logging
app.use(morgan("dev"));

// leer datos desde los formularios
app.use(express.json());
//Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRouter);

export default app;
