import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import http from "http";
import { Server } from "socket.io"; // <-- FIXED: import Server, not server
import cors from "cors"


import authRoutes from "./src/routes/auth.js";
import errorHandler from "./src/middlewares/errorHandler.js";
import pollsRoutes from "./src/routes/polls.js";
import cookieParser from "cookie-parser";
import userRoutes from "./src/routes/user.js";
import pollAnswerRoutes from "./src/routes/pollAnswers.js";
import sessionRoutes from "./src/routes/session.js";
import participantsRoutes from "./src/routes/participants.js";

dotenv.config();
console.log("JWT_SECRET:", process.env.JWT_SECRET);
console.log("JWT_EXPIRES_IN:", process.env.JWT_EXPIRES_IN);



const app = express();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

// Attach io to app so it can be accessed in routes
app.set("io", io);

// cors
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json())
// Socket.IO connection
io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("sendData", (data) => {
        console.log("Data received:", data);
        io.emit("receiver", data);
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

// Middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/polls", pollsRoutes);
app.use("/api/pollsAnswer", pollAnswerRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/participants", participantsRoutes);

// Error handler
app.use(errorHandler);

// Test route
app.get("/", (req, res) => res.send("API running..."));

// Start server with Socket.IO
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
