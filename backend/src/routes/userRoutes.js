import express from "express";
import connection from "../config/database.js";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existing = await connection.query("SELECT * FROM users WHERE email=$1", [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const result = await connection.query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, password] // ⚠️ hash password later
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err); // passes error to global handler
  }
});

// LOGIN
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });

  try {
    const user = await connection.query("SELECT * FROM users WHERE email=$1", [email]);

    if (user.rows.length === 0 || user.rows[0].password_hash !== password) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login successful", user: user.rows[0] });
  } catch (err) {
    next(err);
  }
});

export default router;
