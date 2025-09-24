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

// Update Poll (only draft or hidden, host only)
export const updatePoll = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { question, options } = req.body;
    const host_id = req.user.id;

    const pollQuery = await connection.query("SELECT * FROM polls WHERE id=$1", [id]);
    if (!pollQuery.rows.length) return res.status(404).json({ error: "Poll not found" });

    const poll = pollQuery.rows[0];
    if (poll.host_id !== host_id) return res.status(403).json({ error: "Not authorized" });
    if (!["draft", "hidden"].includes(poll.status))
      return res.status(400).json({ error: "Poll cannot be updated after published" });

    const updated = await connection.query(
      "UPDATE polls SET question=$1, options=$2, updated_at=NOW() WHERE id=$3 RETURNING *",
      [question || poll.question, options || poll.options, id]
    );

    res.json({ message: "Poll updated", poll: updated.rows[0] });
  } catch (err) {
    next(err);
  }
};

// Publish Poll (host only)
export const publishPoll = async (req, res, next) => {
  try {
    const { id } = req.params;
    const host_id = req.user.id;

    const pollQuery = await connection.query("SELECT * FROM polls WHERE id=$1", [id]);
    if (!pollQuery.rows.length) return res.status(404).json({ error: "Poll not found" });

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

// Hide Poll (host only)
export const hidePoll = async (req, res, next) => {
  try {
    const { id } = req.params;
    const host_id = req.user.id;

    const pollQuery = await connection.query("SELECT * FROM polls WHERE id=$1", [id]);
    if (!pollQuery.rows.length) return res.status(404).json({ error: "Poll not found" });

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

// Complete Poll (host only)
export const completePoll = async (req, res, next) => {
  try {
    const { id } = req.params;
    const host_id = req.user.id;

    const pollQuery = await connection.query("SELECT * FROM polls WHERE id=$1", [id]);
    if (!pollQuery.rows.length) return res.status(404).json({ error: "Poll not found" });

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

// Get all polls (host sees all their polls, participants only published + completed)
export const getPolls = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    let query = "";
    let params = [];

    // Host: show all their polls
    query = "SELECT * FROM polls WHERE host_id=$1 ORDER BY created_at DESC";
    params = [user_id];

    const hostResult = await connection.query(query, params);
    if (hostResult.rows.length) {
      return res.json({ polls: hostResult.rows });
    }

    // Participant: show only published or completed polls
    const participantResult = await connection.query(
      "SELECT * FROM polls WHERE status IN ('published', 'completed') ORDER BY created_at DESC"
    );

    res.json({ polls: participantResult.rows });
  } catch (err) {
    next(err);
  }
};

// Get single poll by ID (host sees all, participant only published/completed)
export const getPollById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const pollQuery = await connection.query("SELECT * FROM polls WHERE id=$1", [id]);
    if (!pollQuery.rows.length) return res.status(404).json({ error: "Poll not found" });

    const poll = pollQuery.rows[0];

    // Host can see all their polls
    if (poll.host_id === user_id) return res.json({ poll });

    // Participants can only see published or completed polls
    if (!["published", "completed"].includes(poll.status))
      return res.status(403).json({ error: "Not authorized to view this poll" });

    res.json({ poll });
  } catch (err) {
    next(err);
  }
};

// Get all published polls for a specific session
export const getSessionPolls = async (req, res, next) => {
  try {
    const { session_id } = req.params;
    const result = await connection.query(
      "SELECT * FROM polls WHERE session_id=$1 AND status IN ('published', 'completed') ORDER BY created_at ASC",
      [session_id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "No polls found for this session" });
    }

    res.status(200).json({ polls: result.rows });
  } catch (err) {
    next(err);
  }
};
