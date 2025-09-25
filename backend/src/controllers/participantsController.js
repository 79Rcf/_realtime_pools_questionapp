// controllers/participantsController.js
import connection from "../config/database.js";
import { submitAnswer } from "./pollAnswersController.js";

export const joinSession = async (req, res, next) => {
  try {
    const { session_id } = req.params;
    const { name, phone } = req.body;

    if (!name) return res.status(400).json({ error: "Name is required" });

    const sessionCheck = await connection.query(
      "SELECT * FROM sessions WHERE id=$1 AND status='active'",
      [session_id]
    );
    if (sessionCheck.rows.length === 0) {
      return res.status(404).json({ error: "Session not found or inactive" });
    }

    const result = await connection.query(
      "INSERT INTO participants (session_id, name, phone) VALUES ($1, $2, $3) RETURNING *",
      [session_id, name, phone || null]
    );
    
    const io = req.app.get("io");
    io.to(`session_${poll.session_id}`).emit("pollAnswered", {
      poll_id: poll.id,
      participant_id: participant.id,
      answer: submitAnswer,
    })

    res.status(201).json({
      message: "Joined session",
      participant: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};
