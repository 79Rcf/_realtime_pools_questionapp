import { useState } from "react";
import API from "../../api/axiosInstance";
import styles from "./Signup.module.css";


import { FiUser, FiMail, FiLock } from 'react-icons/fi'; // Feather icons

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/signup", { username, email, password });
      setMessage(res.data.message);

      // ✅ Save token if present
      if (res.data.token) {
        localStorage.setItem("authToken", res.data.token);
        localStorage.setItem("user", JSON.stringify({ username, email }));
      }
    } catch (err) {
      setMessage(err.response?.data?.error || "Error occurred");
    }
  };

 

  return (
    <div className={styles.maincontainer}>
      {/* Left Panel - Welcome/Intro */}
      <div className={styles.leftPanel}>
        <div className={styles.leftPanelContent}>
          <h2 className={styles.leftPanelTitle}>WELCOME BACK!</h2>
          <p className={styles.leftPanelText}>👥 Host a poll, join a session, and compete with others in real time.</p>
        </div>
      </div>

      {/* Right Panel - Sign Up Form */}
      <div className={styles.container}>
        <h2 className={styles.texttitle}>Sign Up</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Input field with icon wrapper */}
          <div className={styles.inputGroup}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <FiUser className={styles.inputIcon} />
          </div>

          <div className={styles.inputGroup}>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <FiMail className={styles.inputIcon} />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FiLock className={styles.inputIcon} />
          </div>
          
          
          <button type="submit" className={styles.signupButton}>
            Sign Up
          </button>
          
        </form>

        {message && <p className={styles.message}>{message}</p>}

        <p className={styles.switchPanelText}>
          Already have an account?{" "}
          <a href="/signin" className={styles.switchLink}>
            Login
          </a>
        </p>
      </div>
    </div>
  )
}

export default Signup