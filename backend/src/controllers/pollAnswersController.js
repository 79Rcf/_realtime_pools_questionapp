import connection from "../config/database.js";

export const submitAnswer = async (req, res, next) => {
  try {
    const { poll_id } = req.params;
    const { participant_id, answer } = req.body;

    // 1️⃣ Check if poll exists and is published
    const pollQuery = await connection.query(
      `SELECT p.id AS poll_id, p.session_id, s.id AS session_id
       FROM polls p
       JOIN sessions s ON s.id = p.session_id
       WHERE p.id = $1 AND p.status = 'published'`,
      [poll_id]
    );

    if (pollQuery.rows.length === 0) {
      return res.status(404).json({ error: "Poll not found, not active, or session does not exist" });
    }

    const session_id = pollQuery.rows[0].session_id;

    // 2️⃣ Check if participant belongs to that session
    const participantQuery = await connection.query(
      "SELECT * FROM participants WHERE id=$1 AND session_id=$2",
      [participant_id, session_id]
    );

    if (participantQuery.rows.length === 0) {
      return res.status(403).json({ error: "Participant not in this session" });
    }

    const participant = participantQuery.rows[0]; // get participant info
    const user_id = participant.user_id; // reference user

    // 3️⃣ Insert the answer
    const result = await connection.query(
      "INSERT INTO poll_answers (poll_id, participant_id, answer) VALUES ($1, $2, $3) RETURNING *",
      [poll_id, user_id, answer]
    );

    res.status(201).json({ message: "Answer submitted", answer: result.rows[0] });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(400).json({ error: "You already answered this poll" });
    }
    next(err);
  }
};
