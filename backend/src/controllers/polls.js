import connection from "../config/database.js";

// Create Poll (draft by default)
export const createPoll = async (req, res, next) => {
  try {
    const { question, options, session_id } = req.body;
    const host_id = req.user.id;

    if (!question || !options || options.length < 2) {
      return res.status(400).json({ error: "Question and at least 2 options are required" });
    }

    const result = await connection.query(
      "INSERT INTO polls (host_id, question, options, status, session_id) VALUES ($1, $2, $3, 'draft', $4) RETURNING *",
      [host_id, question, options, session_id]
    );

    res.status(201).json({ message: "Poll created (draft)", poll: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// Update Poll (only draft or hidden)
export const updatePoll = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { question, options } = req.body;
    const host_id = req.user.id;

    const pollQuery = await connection.query("SELECT * FROM polls WHERE id=$1", [id]);
    if (pollQuery.rows.length === 0) return res.status(404).json({ error: "Poll not found" });

    const poll = pollQuery.rows[0];
    if (poll.host_id !== host_id) return res.status(403).json({ error: "Not authorized" });
    if (!["draft", "hidden"].includes(poll.status)) return res.status(400).json({ error: "Poll cannot be updated after published" });

    const updated = await connection.query(
      "UPDATE polls SET question=$1, options=$2, updated_at=NOW() WHERE id=$3 RETURNING *",
      [question || poll.question, options || poll.options, id]
    );

    res.json({ message: "Poll updated", poll: updated.rows[0] });
  } catch (err) {
    next(err);
  }
};

// Publish Poll
export const publishPoll = async (req, res, next) => {
  try {
    const { id } = req.params;
    const host_id = req.user.id;

    const pollQuery = await connection.query("SELECT * FROM polls WHERE id=$1", [id]);
    if (pollQuery.rows.length === 0) return res.status(404).json({ error: "Poll not found" });
    const poll = pollQuery.rows[0];

    if (poll.host_id !== host_id) return res.status(403).json({ error: "Not authorized" });
    if (poll.status === "completed") return res.status(400).json({ error: "Poll already completed" });

    const result = await connection.query(
      "UPDATE polls SET status='published', publish_at=NOW(), updated_at=NOW() WHERE id=$1 RETURNING *",
      [id]
    );

    res.json({ message: "Poll published", poll: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// Hide Poll
export const hidePoll = async (req, res, next) => {
  try {
    const { id } = req.params;
    const host_id = req.user.id;

    const pollQuery = await connection.query("SELECT * FROM polls WHERE id=$1", [id]);
    if (pollQuery.rows.length === 0) return res.status(404).json({ error: "Poll not found" });
    const poll = pollQuery.rows[0];

    if (poll.host_id !== host_id) return res.status(403).json({ error: "Not authorized" });

    const result = await connection.query(
      "UPDATE polls SET status='hidden', updated_at=NOW() WHERE id=$1 RETURNING *",
      [id]
    );

    res.json({ message: "Poll hidden", poll: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// Complete Poll
export const completePoll = async (req, res, next) => {
  try {
    const { id } = req.params;
    const host_id = req.user.id;

    const pollQuery = await connection.query("SELECT * FROM polls WHERE id=$1", [id]);
    if (pollQuery.rows.length === 0) return res.status(404).json({ error: "Poll not found" });
    const poll = pollQuery.rows[0];

    if (poll.host_id !== host_id) return res.status(403).json({ error: "Not authorized" });

    const result = await connection.query(
      "UPDATE polls SET status='completed', updated_at=NOW() WHERE id=$1 RETURNING *",
      [id]
    );

    res.json({ message: "Poll completed", poll: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// Get all polls (optionally filter by status)
export const getPolls = async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = "SELECT * FROM polls";
    let params = [];

    if (status) {
      query += " WHERE status=$1";
      params.push(status);
    }

    const result = await connection.query(query, params);
    res.json({ polls: result.rows });
  } catch (err) {
    next(err);
  }
};

// Get single poll
export const getPollById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await connection.query("SELECT * FROM polls WHERE id=$1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Poll not found" });
    res.json({ poll: result.rows[0] });
  } catch (err) {
    next(err);
  }
};// Get all published polls for a specific session
export const getSessionPolls = async (req, res, next) => {
  try {
    const { session_id } = req.params;
    const result = await connection.query(
      "SELECT * FROM polls WHERE session_id=$1 AND status='published'",
      [session_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No published polls found for this session" });
    }

    res.status(200).json({ polls: result.rows });
  } catch (err) {
    next(err);
  }
};

