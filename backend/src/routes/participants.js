// routes/participants.js
import express from "express";
import { joinSession } from "../controllers/participantsController.js";

const router = express.Router();

router.post("/:session_id/join", joinSession);

export default router;
