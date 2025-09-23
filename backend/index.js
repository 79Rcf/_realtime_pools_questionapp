// src/index.js
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import authRoutes from "./routes/auth.js";
import errorHandler from "./middlewares/errorHandler.js";

dotenv.config();
const app = express();

// Middlewares
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/auth", authRoutes);

// Error handler
app.use(errorHandler);

app.get("/", (req, res) => res.send("API running..."));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
