import bcrypt from "bcryptjs";
import connection from "../config/database.js";

export const createUser = async ({ username, email, password }) => {
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  const result = await connection.query(
    "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, created_at",
    [username, email, password_hash]
  );

  return result.rows[0];
};

export const findUserByEmail = async (email) => {
  const result = await connection.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );
  return result.rows[0]; // returns user object or undefined
};

export const findUserById = async (id) => {
  const result = await connection.query(
    "SELECT id, username, email, created_at FROM users WHERE id=$1",
    [id]
  );
  return result.rows[0];
};
