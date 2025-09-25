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
    if (!["draft", "hidden"].includes(poll.status)) {
      return res.status(400).json({ error: "Poll cannot be updated after published" });
    }

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

export const getPolls = async (req, res, next) => {
  try {
    const { status } = req.query;
    const userId = req.user.id;

    let query;
    let params;

    if (req.user.role === "host") {
      // Hosts can see all their polls
      if (status) {
        query = "SELECT * FROM polls WHERE host_id=$1 AND status=$2";
        params = [userId, status];
      } else {
        query = "SELECT * FROM polls WHERE host_id=$1";
        params = [userId];
      }
    } else {
      // Participants only see published polls
      query = "SELECT * FROM polls WHERE status='published'";
      params = [];
    }

    const result = await connection.query(query, params);
    res.json({ polls: result.rows });
  } catch (err) {
    next(err);
  }
};

// Get single poll (with access control)
export const getPollById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const pollQuery = await connection.query("SELECT * FROM polls WHERE id=$1", [id]);
    if (pollQuery.rows.length === 0) return res.status(404).json({ error: "Poll not found" });

    const poll = pollQuery.rows[0];

    if (req.user.role === "host") {
      // Hosts can only view their own polls
      if (poll.host_id !== userId) {
        return res.status(403).json({ error: "Not authorized" });
      }
      return res.json({ poll });
    } else {
      // Participants only see published polls
      if (poll.status !== "published") {
        return res.status(403).json({ error: "This poll is not available" });
      }
      return res.json({ poll });
    }
  } catch (err) {
    next(err);
  }
};

// ✅ Get polls for a specific session (optionally filter by status)
export const getSessionPolls = async (req, res, next) => {
  try {
    const { sessions_id } = req.params;
    const { status } = req.query;

    let query = "SELECT * FROM polls WHERE session_id=$1";
    let params = [sessions_id];

    if (status) {
      query += " AND status=$2";
      params.push(status);
    }

    const result = await connection.query(query, params);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No polls found for this session" });
    }

    res.json({ polls: result.rows });
  } catch (err) {
    next(err);
  }
};
