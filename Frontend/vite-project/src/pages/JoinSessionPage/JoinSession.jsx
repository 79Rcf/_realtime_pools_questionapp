import React, { useState } from "react";
import { useSocket } from "../../context/SocketContext";
import { useNavigate } from "react-router-dom";

const JoinSession = () => {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); // For host login
  const [password, setPassword] = useState(""); // For host login
  const [isHost, setIsHost] = useState(false);
  const socket = useSocket();
  const navigate = useNavigate();

  // Participant join
  const handleParticipantJoin = (e) => {
    e.preventDefault();
    if (code && name) {
      socket?.emit("join_session", { code, name, role: "participant" });
      navigate("/participant", { state: { code, name } });
    } else {
      alert("Enter session code and name to join as participant");
    }
  };

  // Host login/join
  const handleHostJoin = (e) => {
    e.preventDefault();
    if (email && password) {
      // Here you would normally validate login via API
      // For demo, we just navigate to dashboard
      socket?.emit("join_session", { role: "host", email });
      navigate("/dashboard", { state: { email } });
    } else {
      alert("Enter email and password to join as host");
    }
  };

  return (
    <div>
      <h2>Join a Session..</h2>

      {!isHost ? (
        <>
          {/* Participant Form */}
          <form>
            <input
              placeholder="Session Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <input
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div style={{ marginTop: "1rem" }}>
              <button onClick={handleParticipantJoin} type="button">
                Join as Participant
              </button>
              <button
                onClick={() => setIsHost(true)}
                type="button"
                style={{ marginLeft: "1rem" }}
              >
                Join as Host
              </button>
            </div>
          </form>
        </>
      ) : (
        <>
          {/* Host Form */}
          <h3>Host Login</h3>
          <form>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div style={{ marginTop: "1rem" }}>
              <button onClick={handleHostJoin} type="button">
                Login as Host
              </button>
              <button
                onClick={() => setIsHost(false)}
                type="button"
                style={{ marginLeft: "1rem" }}
              >
                Back to Participant
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default JoinSession;
