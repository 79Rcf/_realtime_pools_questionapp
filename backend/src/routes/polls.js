// backend/src/routes/polls.js
import express from "express";
import {
  createPoll,
  updatePoll,
  publishPoll,
  hidePoll,
  completePoll,
  getPolls,
  getPollById,
  getSessionPolls,
} from "../controllers/polls.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Host creates a poll (draft mode)
router.post("/", protect, createPoll);

// Host updates a poll (only draft/hidden)
router.put("/:id", protect, updatePoll);

// Host publishes a poll
router.patch("/:id/publish", protect, publishPoll);

// Host hides a poll
router.patch("/:id/hide", protect, hidePoll);

// Host completes a poll
router.patch("/:id/complete", protect, completePoll);

// Get all polls (host sees all their polls, participants see published/completed)
router.get("/", protect, getPolls);

// Get single poll by ID (host sees all, participant only published/completed)
router.get("/:id", protect, getPollById);

// Get all published/completed polls for a specific session
router.get("/session/:session_id", protect, getSessionPolls);

export default router;
