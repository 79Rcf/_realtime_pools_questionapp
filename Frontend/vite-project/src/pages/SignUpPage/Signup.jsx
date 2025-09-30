// import { useState } from "react";
// import API from "../../api/axiosInstance";
// import styles from "./Signup.module.css";

// const Signup = () => {
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await API.post("/auth/signup", { username, email, password });
//       setMessage(res.data.message);
//     } catch (err) {
//       setMessage(err.response?.data?.error || "Error occurred");
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <h2>Sign Up</h2>
//       <form onSubmit={handleSubmit} className={styles.form}>
//         <input
//           type="text"
//           placeholder="Username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           required
//         />
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <button type="submit">Sign Up</button>
//       </form>
//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export default Signup;


import { useState } from "react";
import API from "../../api/axiosInstance";
import styles from "./Signup.module.css";

const Signup = () => {
  // Sign up state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Session login state
  const [sessionUsername, setSessionUsername] = useState("");
  const [sessionCode, setSessionCode] = useState("");
  // Messages
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/signup", {
        username,
        email,
        password,
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error || "Error occurred");
    }
  };

  const handleSessionLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/session-login", {
        code: sessionCode,
        username: sessionUsername,
      });
      setMessage(res.data.message || "Joined session successfully!");
    } catch (err) {
      setMessage(err.response?.data?.error || "Error occurred");
    }
  };

  return (
    <div className={styles.container}>
      {/* Sign Up Box */}
      <div className={styles.box}>
        <h2>Sign Up</h2>
        <form onSubmit={handleSignup} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit">Sign Up</button>
        </form>
      </div>

      {/* Session Login Box */}
      <div className={styles.box}>
        <h2>Join with Session Code</h2>
        <form onSubmit={handleSessionLogin} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="sessionUsername">Your Name</label>
            <input
              id="sessionUsername"
              type="text"
              placeholder="Enter your name"
              value={sessionUsername}
              onChange={(e) => setSessionUsername(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="sessionCode">Session Code</label>
            <input
              id="sessionCode"
              type="text"
              placeholder="Enter session code"
              value={sessionCode}
              onChange={(e) => setSessionCode(e.target.value)}
              required
            />
          </div>

          <button type="submit">Join Session</button>
        </form>
      </div>

      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default Signup;

