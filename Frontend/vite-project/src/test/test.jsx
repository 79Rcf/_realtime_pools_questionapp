import { useEffect, useState } from "react";
import { signUp, signIn } from "../api/auth";
import API from "../api/axiosInstance";

const TestFlow = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Clear old tokens (only for testing)

    const addLog = (msg) => setLogs((prev) => [...prev, msg]);

    const runTest = async () => {
      try {
        const signupRes = await signUp({
          username: "testuser11",
          email: "test11@example.com",
          password: "123456",
        });
        addLog      ("SignUp: " + JSON.stringify(signupRes.data));

        const signinRes = await signIn({
          email: "test11@example.com",
          password: "123456",
        });
        addLog("SignIn: " + JSON.stringify(signinRes.data));

        // Save token
        localStorage.setItem("token", signinRes.data.token);
        addLog("Token saved to localStorage.");


        await new Promise((resolve) => setTimeout(resolve, 0));

        // Fetch protected /polls
        const pollsRes = await API.get("/polls");
        addLog("Polls fetched: " + JSON.stringify(pollsRes.data));
      } catch (err) {
        addLog("Error: " + JSON.stringify(err.response?.data || err.message));
      }
    };

    runTest();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Test Flow Logs</h2>
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

export default TestFlow;
