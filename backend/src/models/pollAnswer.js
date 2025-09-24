import connection from "../config/database.js";

// Get all users who answered a specific poll
export const getUsersByPollId = async (poll_id) => {
  const result = await connection.query(
    `SELECT u.id, u.username, u.email, pa.answer, pa.answered_at
     FROM poll_answers pa
     JOIN users u ON u.id = pa.participant_id
     WHERE pa.poll_id=$1`,
    [poll_id]
  );
  return result.rows;
};

// Get a specific user who answered a specific poll
export const getUserByPollIdAndUserId = async (poll_id, user_id) => {
  const result = await connection.query(
    `SELECT u.id, u.username, u.email, pa.answer, pa.answered_at
     FROM poll_answers pa
     JOIN users u ON u.id = pa.participant_id
     WHERE pa.poll_id=$1 AND pa.participant_id=$2`,
    [poll_id, user_id]
  );
  return result.rows[0];
};
