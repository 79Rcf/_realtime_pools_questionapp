import express from "express";
import connection from "../config/database.js";
import { createSession, getSessionByCode } from "../controllers/session.js";
import { protect } from "../middlewares/authMiddleware.js";
import { getSessionPolls } from "../controllers/polls.js";

const router = express.Router();

// Create a new session (protected)
router.post("/", protect, createSession);


// Get session by code
router.get("/code/:code", getSessionByCode)


// Get polls for a session
router.get("/:session_id/polls", getSessionPolls);

export default router;
