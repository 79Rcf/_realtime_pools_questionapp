// controllers/session.js
import connection from "../config/database.js";
import crypto from "crypto";

// Create a session
export const createSession = async (req, res, next) => {
  try {
    const hostId = req.user.id; // comes from JWT (protect middleware)

   
    const code = crypto.randomBytes(3).toString("hex").toUpperCase();

    const join_link = `${process.env.BASE_URL || "http://localhost:3000"}/join/${code}`;

    const result = await connection.query(
      `INSERT INTO sessions (host_id, code, join_link) 
       VALUES ($1, $2, $3) RETURNING *`,
      [hostId, code, join_link]
    );

    res.status(201).json({
      message: "Session created successfully",
      session: result.rows[0],
    });
  } catch (err) {
    console.error(" Create Session Error:", err);
    next(err);
  }
};
export const getSessionByCode = async (req, res) => {
  const { code } = req.params;
  try {
    const result = await connection.query(
      "SELECT * FROM sessions WHERE code=$1 AND status='active'",
      [code]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Session not found or inactive" });
    }

    res.json({ session: result.rows[0] });
  } catch (err) {
    console.error("Get Session By Code Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
