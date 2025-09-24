import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getPollUsers, getPollUserById } from "../controllers/pollAnswerContrller.js";

const router = express.Router();

// Get all users who answered a poll
router.get("/:poll_id/users", protect, getPollUsers);

// Get a specific user who answered a poll
router.get("/:poll_id/users/:user_id", protect, getPollUserById);

export default router;
