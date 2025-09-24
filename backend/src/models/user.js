import connection from "../config/database.js";

// Get all users
export const findAllUsers = async () => {
  const result = await connection.query(
    "SELECT id, username, email, created_at FROM users"
  );
  return result.rows;
};

// Get a user by ID
export const findUserById = async (id) => {
  const result = await connection.query(
    "SELECT id, username, email, created_at FROM users WHERE id=$1",
    [id]
  );
  return result.rows[0];
};
