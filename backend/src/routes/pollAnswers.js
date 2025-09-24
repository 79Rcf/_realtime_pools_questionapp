// routes/pollAnswers.js
import express from "express";
import { submitAnswer } from "../controllers/pollAnswersController.js";

const router = express.Router();

// Participant submits an answer to a poll
router.post("/:poll_id/answer", submitAnswer);

export default router;
