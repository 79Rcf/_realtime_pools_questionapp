import { useEffect, useState } from "react";
import API from "../api/axiosInstance";

const TestPoll = () => {
  const [logs, setLogs] = useState([]);
  const pollId = 23; // replace with your poll ID
  const participantId = 2; // replace with your participant ID

  const addLog = (msg) => setLogs((prev) => [...prev, msg]);

  const runTest = async () => {
    try {
      // 1. Submit an answer
      const submitRes = await API.post(`/pollsAnswer/${pollId}/submit`, {
        participant_id: participantId,
        answer: "Python", // choose an option from your poll
      });
      addLog("Answer submitted: " + JSON.stringify(submitRes.data));

      // 2. Fetch poll results
      const resultsRes = await API.get(`/pollsAnswer/${pollId}/results`);
      addLog("Poll results: " + JSON.stringify(resultsRes.data));
    } catch (err) {
      addLog("Error: " + JSON.stringify(err.response?.data || err.message));
    }
  };

  useEffect(() => {
    // Clear old token for testing if needed
    // localStorage.clear();

    // Make sure token is saved if your routes are protected
    // localStorage.setItem("token", "<your_valid_token_here>");

    runTest();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Poll Test Logs</h2>
      <ul>
        {logs.map((log, i) => (
          <li key={i} style={{ marginBottom: "10px" }}>
            {log}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TestPoll;
