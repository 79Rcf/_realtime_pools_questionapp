import express from 'express';
import connection from '../config/database.js';
const router = express.Router();

// SUBMIT ANSWER
router.post("/answer", async (req, res, next) => {
  const { pollId, userId, answer } = req.body;

  if (!pollId || !userId || !answer) {
    return res.status(400).json({ error: "pollId, userId, and answer are required" });
  }

  try {
    // Check if poll exists and options include the answer
    const pollQuery = await connection.query("SELECT options FROM polls WHERE id=$1", [pollId]);
    if (pollQuery.rows.length === 0) {
      return res.status(404).json({ error: "Poll not found" });
    }

    const poll = pollQuery.rows[0];
    if (!poll.options.includes(answer)) {
      return res.status(400).json({ error: "Answer must be one of the poll options" });
    }

    // Insert answer
    const answerResult = await connection.query(
      "INSERT INTO polls_answer (poll_id, user_id, answer) VALUES ($1, $2, $3) RETURNING *",
      [pollId, userId, answer]
    );

    res.status(201).json({
      message: "Answer submitted successfully",
      answer: answerResult.rows[0]
    });
  } catch (err) {
    console.error("💥 Submit Answer Error:", err);
    next(err);
  }
});

export default router;
