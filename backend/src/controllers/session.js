// controllers/session.js
import connection from "../config/database.js";
import crypto from "crypto";

// Create a session
export const createSession = async (req, res, next) => {
  try {
    const hostId = req.user.id; // comes from JWT (protect middleware)

    // Generate random 6-char code§ 1
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
