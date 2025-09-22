import express from "express";
import connection from "../config/database.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, async (req, res, next) => {
  try {
    const { pollId } = req.body;       
    const creator_id = req.user.id;   

    if (!pollId) return res.status(400).json({ error: "pollId is required" });

    const result = await connection.query(
      "INSERT INTO sessions (poll_id, creator_id, started_at) VALUES ($1, $2, NOW()) RETURNING *",
      [pollId, creator_id]
    );

    res.status(201).json({
      message: "Session created successfully",
      session: result.rows[0],
    });
  } catch (err) {
    next(err);
  }                 
});                   

router.post("/join", protect, async (req, res, next) => {
  try {
    const { sessionId } = req.body;
    const userId = req.user.id;

    if (!sessionId) return res.status(400).json({ error: "Session ID required" });

    const existing = await connection.query(
      "SELECT * FROM session_participants WHERE session_id=$1 AND user_id=$2",
      [sessionId, userId]
    );

    if (existing.rows.length > 0)
      return res.status(400).json({ error: "User already joined this session" });

    const result = await connection.query(
      "INSERT INTO session_participants (session_id, user_id) VALUES ($1, $2) RETURNING *",
      [sessionId, userId]
    );

    res.status(201).json({
      message: "Joined session successfully",
      participant: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
});

export default router;
