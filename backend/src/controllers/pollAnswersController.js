// ✅ NEW – controllers/pollAnswersController.js
import connection from "../config/database.js";

export const submitAnswer = async (req, res, next) => {
  try {
    const { poll_id } = req.params;
    const { participant_id, answer } = req.body;

    const pollCheck = await connection.query(
      "SELECT * FROM polls WHERE id=$1 AND status='published'",
      [poll_id]
    );
    if (pollCheck.rows.length === 0) {
      return res.status(404).json({ error: "Poll not found or not active" });
    }

    const participantCheck = await connection.query(
      "SELECT * FROM participants WHERE id=$1 AND session_id=$2",
      [participant_id, pollCheck.rows[0].session_id]
    );
    if (participantCheck.rows.length === 0) {
      return res.status(403).json({ error: "Participant not in this session" });
    }

    const result = await connection.query(
      "INSERT INTO poll_answers (poll_id, participant_id, answer) VALUES ($1, $2, $3) RETURNING *",
      [poll_id, participant_id, answer]
    );

    res.status(201).json({ message: "Answer submitted", answer: result.rows[0] });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(400).json({ error: "You already answered this poll" });
    }
    next(err);
  }
};
