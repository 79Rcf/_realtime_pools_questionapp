import connection from "../config/database.js";

export const joinSession = async (req, res, next) => {
  try {
    const { session_id } = req.params;
    const { name, phone, user_id } = req.body;

    if (!name) return res.status(400).json({ error: "Name is required" });
    if (!user_id) return res.status(400).json({ error: "User ID is required" });

    const userCheck = await connection.query(
      "SELECT * FROM users WHERE id=$1",
      [user_id]
    );
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

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

    res.status(201).json({
      message: "Joined session",
      participant: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};
