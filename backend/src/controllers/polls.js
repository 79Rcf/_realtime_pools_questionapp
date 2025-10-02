import connection from "../config/database.js";
import { qstashClient } from "../config/qstash.js";
import { CHANNEL } from "../config/notifications.js";

// 🛠️ helper to normalize DB poll rows into a flat object
const normalizePoll = (poll) => ({
  id: poll.id,
  question: poll.question,
  options: poll.options,
  status: poll.status,
  sessionId: poll.session_id,
  hostId: poll.host_id,
  createdAt: poll.created_at,
  updatedAt: poll.updated_at,
  publishAt: poll.publish_at,
});

// -------------------- CREATE POLL --------------------
export const createPoll = async (req, res, next) => {
  try {
    const { question, options, session_id } = req.body;
    const host_id = req.user.id;

    if (!question || !options || options.length < 2) {
      return res.status(400).json({ error: "Question and at least 2 options are required" });
    }

    const result = await connection.query(
      `INSERT INTO polls (host_id, question, options, status, session_id)
       VALUES ($1, $2, $3, 'draft', $4) RETURNING *`,
      [host_id, question, options, session_id]
    );

    res.status(201).json(normalizePoll(result.rows[0]));
  } catch (err) {
    next(err);
  }
};

// -------------------- UPDATE POLL --------------------
export const updatePoll = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { question, options } = req.body;
    const host_id = req.user.id;

    const pollQuery = await connection.query("SELECT * FROM polls WHERE id=$1", [id]);
    if (!pollQuery.rows.length) return res.status(404).json({ error: "Poll not found" });

    const poll = pollQuery.rows[0];
    if (poll.host_id !== host_id) return res.status(403).json({ error: "Not authorized" });
    if (!["draft", "hidden"].includes(poll.status)) {
      return res.status(400).json({ error: "Poll cannot be updated after published" });
    }

    const updated = await connection.query(
      "UPDATE polls SET question=$1, options=$2, updated_at=NOW() WHERE id=$3 RETURNING *",
      [question || poll.question, options || poll.options, id]
    );

    res.json(normalizePoll(updated.rows[0]));
  } catch (err) {
    next(err);
  }
};

// -------------------- PUBLISH POLL --------------------
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

    const io = req.app.get("io");
    io.to(`session_${poll.session_id}`).emit("pollPublished", result.rows[0]);

    console.log(`QStash notification sent on channel: ${CHANNEL}`);
    res.json(normalizePoll(result.rows[0]));
  } catch (err) {
    next(err);
  }
};

// -------------------- HIDE POLL --------------------
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

    res.json(normalizePoll(result.rows[0]));
  } catch (err) {
    next(err);
  }
};

// -------------------- COMPLETE POLL --------------------
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

    res.json(normalizePoll(result.rows[0]));
  } catch (err) {
    next(err);
  }
};

// -------------------- GET POLLS --------------------
export const getPolls = async (req, res, next) => {
  try {
    const { status } = req.query;
    const userId = req.user.id;

    let query;
    let params;

    if (req.user.role === "host") {
      query = status
        ? "SELECT * FROM polls WHERE host_id=$1 AND status=$2"
        : "SELECT * FROM polls WHERE host_id=$1";
      params = status ? [userId, status] : [userId];
    } else {
      query = "SELECT * FROM polls WHERE status='published'";
      params = [];
    }

    const result = await connection.query(query, params);
    res.json(result.rows.map(normalizePoll));
  } catch (err) {
    next(err);
  }
};

// -------------------- GET SINGLE POLL --------------------
export const getPollById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const pollQuery = await connection.query("SELECT * FROM polls WHERE id=$1", [id]);
    if (!pollQuery.rows.length) return res.status(404).json({ error: "Poll not found" });

    const poll = pollQuery.rows[0];

    if (req.user.role === "host") {
      if (poll.host_id !== userId) return res.status(403).json({ error: "Not authorized" });
      return res.json(normalizePoll(poll));
    } else {
      if (poll.status !== "published") return res.status(403).json({ error: "This poll is not available" });
      return res.json(normalizePoll(poll));
    }
  } catch (err) {
    next(err);
  }
};
   
   
     // -------------------- DELETE POLL --------------------
export const deletePoll = async (req, res, next) => {
  try {
    const { id } = req.params;
    const host_id = req.user.id;

    // check if poll exists
    const pollQuery = await connection.query("SELECT * FROM polls WHERE id=$1", [id]);
    if (!pollQuery.rows.length) {
      return res.status(404).json({ error: "Poll not found" });
    }

    const poll = pollQuery.rows[0];

    // only host who created it can delete
    if (poll.host_id !== host_id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // only allow delete if poll is draft or hidden
    if (!["draft", "hidden"].includes(poll.status)) {
      return res.status(400).json({ error: "Only draft or hidden polls can be deleted" });
    }

    await connection.query("DELETE FROM polls WHERE id=$1", [id]);

    res.json({ message: "Poll deleted", id: poll.id });
  } catch (err) {
    next(err);
  }
};







// -------------------- GET POLLS FOR A SESSION --------------------
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
    if (!result.rows.length) return res.status(404).json({ error: "No polls found for this session" });

    res.json(result.rows.map(normalizePoll));
  } catch (err) {
    next(err);
  }
};
