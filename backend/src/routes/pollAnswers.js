// routes/pollAnswers.js
import express from "express";
import { submitAnswer } from "../controllers/pollAnswersController.js";
import { protect } from "../middlewares/authMiddleware.js"

const router = express.Router();


router.post("/:poll_id/answer", protect, submitAnswer);


export default router;
