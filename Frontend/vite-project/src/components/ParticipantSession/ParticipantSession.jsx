import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
// import { useSocket } from "../../context/SocketContext";

const ParticipantSession = () => {
  const socket = useSocket();
  const location = useLocation();
  const { code, name } = location.state || {}; // session info passed from JoinSession

  const [polls, setPolls] = useState([]);
  const [responses, setResponses] = useState({}); // pollId → selected option

  useEffect(() => {
    if (!socket) return;

    // Listen for polls being published
    socket.on("poll_published", (poll) => {
      setPolls((prev) => [...prev, poll]);
    });

    // Listen for poll being closed
    socket.on("poll_closed", (pollId) => {
      setPolls((prev) =>
        prev.map((p) =>
          p.id === pollId ? { ...p, status: "closed" } : p
        )
      );
    });

    return () => {
      socket.off("poll_published");
      socket.off("poll_closed");
    };
  }, [socket]);

  const handleVote = (pollId, option) => {
    setResponses({ ...responses, [pollId]: option });

    socket.emit("submit_response", {
      code,
      name,
      pollId,
      option,
    });
  };

  return (
    <div>
      <h1>Welcome, {name}</h1>
      <h2>Session Code: {code}</h2>

      {polls.length === 0 ? (
        <p>Waiting for host to publish polls...</p>
      ) : (
        polls.map((poll) => (
          <div key={poll.id} style={{ border: "1px solid #ccc", margin: "1rem", padding: "1rem" }}>
            <h3>{poll.question}</h3>
            {poll.status === "published" ? (
              poll.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleVote(poll.id, opt)}
                  disabled={responses[poll.id] === opt}
                >
                  {opt}
                </button>
              ))
            ) : (
              <p>Poll closed</p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ParticipantSession;
