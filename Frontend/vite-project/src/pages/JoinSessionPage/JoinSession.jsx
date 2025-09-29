import { useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/axiosInstance";
import styles from "./JoinSession.module.css";

const JoinSession = () => {
  const { code } = useParams();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");

  const handleJoin = async () => {
    try {
      // 1️⃣ Get session by code
      const sessionRes = await API.get(`/sessions/code/${code}`);
      const session_id = sessionRes.data.session.id;

      // 2️⃣ Join session
      const res = await API.post(`/participants/${session_id}/join`, {
        user_id: parseInt(userId),
        name,
        phone,
      });
      setMessage(`✅ Joined session: ${res.data.participant.unique_code}`);
    } catch (err) {
      setMessage(err.response?.data?.error || "Error occurred");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Join Session ({code})</h2>
      <input
        type="number"
        placeholder="User ID (required)"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Name (required)"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Phone (optional)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button onClick={handleJoin}>Join Session</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default JoinSession;
