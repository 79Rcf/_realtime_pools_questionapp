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


import { FiUser, FiMail, FiLock } from 'react-icons/fi'; // Feather icons

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
    <div className={styles.container}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}

export default Signup;
