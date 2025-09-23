import express from "express";
import {
  createPoll,
  updatePoll,
  publishPoll,
  hidePoll,
  completePoll,
  getPolls,
  getPollById,
} from "../controllers/polls.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Host creates a poll (draft mode)
router.post("/", protect, createPoll);

// Host updates a poll (only if draft/hidden)
router.put("/:id", protect, updatePoll);

// Host publishes a poll
router.put("/:id/publish", protect, publishPoll);

// Host hides a poll
router.put("/:id/hide", protect, hidePoll);

// Host completes a poll
router.put("/:id/complete", protect, completePoll);

// Get all polls (optional filter by status)
router.get("/", protect, getPolls);

// Get single poll by ID
router.get("/:id", protect, getPollById);

export default router;
