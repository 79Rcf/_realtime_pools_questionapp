// src/routes/userRoutes.js
import express from "express";
import connection from "../config/database.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existing = await connection.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await connection.query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// LOGIN
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  try {
    const userQuery = await connection.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (userQuery.rows.length === 0) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const user = userQuery.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.status(200).json({
      message: "Login successful",
      user: { id: user.id, name: user.name, email: user.email },
      token,
    });
  } catch (err) {
    next(err);
  }
});

// GET ALL USERS
router.get("/", async (req, res, next) => {
  try {
    const users = await connection.query("SELECT id, name, email FROM users");
    res.status(200).json(users.rows);
  } catch (err) {
    next(err);
  }
});

export default router;
