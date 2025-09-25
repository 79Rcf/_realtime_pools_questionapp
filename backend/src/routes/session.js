import express from "express";
import { createSession } from "../controllers/session.js";
import { protect } from "../middlewares/authMiddleware.js";
import { getSessionPolls } from "../controllers/polls.js";

const router = express.Router();

router.post("/", protect, createSession);

router.get("/:sessions_id/polls", getSessionPolls);

export default router;
