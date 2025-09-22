import express from "express";
import connection from "../config/database.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// CREATE POLL (Protected)
router.post("/", protect, async (req, res, next) => {
  const { question, options } = req.body;
  const userId = req.user.id; // comes from JWT token

  if (!question || !options || !userId) {
    return res.status(400).json({ error: "Question, options, and userId are required" });
  }

  try {
    const pollResult = await connection.query(
      "INSERT INTO polls (question, options, created_by) VALUES ($1, $2, $3) RETURNING *",
      [question, options, userId]
    );

    res.status(201).json({
      message: "Poll created successfully",
      poll: pollResult.rows[0],
    });
  } catch (err) {
    next(err);
  }
});

export default router;
