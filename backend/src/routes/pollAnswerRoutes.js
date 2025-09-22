import express from 'express';
import connection from '../config/database.js';
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/answer", protect, async (req, res, next) => {
  const { pollId, answer } = req.body;
  const userId = req.user.id; 

  if (!pollId || !answer) {
    return res.status(400).json({ error: "pollId and answer are required" });
  }

  try {
   
    const pollQuery = await connection.query(
      "SELECT options FROM polls WHERE id=$1",
      [pollId]
    );

    if (pollQuery.rows.length === 0) {
      return res.status(404).json({ error: "Poll not found" });
    }

    const poll = pollQuery.rows[0];

 
    if (!poll.options.includes(answer)) {
      return res.status(400).json({
        error: "Answer must be one of the poll options",
        validOptions: poll.options
      });
    }

    // Insert into correct table
    const answerResult = await connection.query(
      "INSERT INTO poll_answers (poll_id, user_id, answer) VALUES ($1, $2, $3) RETURNING *",
      [pollId, userId, answer]
    );

    res.status(201).json({
      message: "Answer submitted successfully",
      answer: answerResult.rows[0]
    });

  } catch (err) {
    console.error("💥 Submit Answer Error:", err); // detailed console log
    next(err); // global error handler will catch
  }
});

export default router;
