// import React, { useState, useEffect } from "react";
// // import { Link, useNavigate } from "react-router-dom";
// // import api from '../../services/api.js';
// // import { connectSocket, onUserRegistered } from '../../services/socket.js';


// export default function Register() {
//   const [form, setForm] = useState({ username: "", email: "", password: "" });
//   const [errors, setErrors] = useState({});
//   const navigate = useNavigate();

//   // Validate form
//   const validate = () => {
//     const newErrors = {};
//     if (!form.username.trim()) newErrors.username = "Username is required";
//     if (!form.email.trim()) newErrors.email = "Email is required";
//     else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Email is invalid";
//     if (!form.password.trim()) newErrors.password = "Password is required";
//     else if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";
//     return newErrors;
//   };

//   // Handle form submission
//   const handleRegister = async (e) => {
//   e.preventDefault();
//   const validationErrors = validate();
//   if (Object.keys(validationErrors).length > 0) {
//     setErrors(validationErrors);
//     return;
//   }

//   setErrors({});
//   try {
//     const { data } = await api.post('/api/auth/register', form); // Updated path
//     console.log( data);
//     navigate('/dashboard');
//   } catch (error) {
//     console.error('Registration failed:', error.message);
//     setErrors({ general: 'Registration failed. Try again.' });
//   }
// };

//   // Handle input changes
//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // Socket.IO setup
//   useEffect(() => {
//     connectSocket();
//     onUserRegistered((data) => {
//       console.log('User registered event:', data);
//       if (data.email === form.email) {
//         navigate('/dashboard');
//       }
//     });
//     return () => {
//       // Cleanup on unmount
//     };
//   }, [form.email, navigate]);

//   return (
//     <div className={styles.container}>
//       <div className={styles.card}>
//         <h2 className={styles.title}>Create Your Account</h2>
//         <p className={styles.subtitle}>Fill in the details to register your account.</p>

//         <form className={styles.form} onSubmit={handleRegister}>
//           <label>Username</label>
//           <input
//             type="text"
//             name="username"
//             placeholder="Your name"
//             value={form.username}
//             onChange={handleChange}
//           />
//           {errors.username && <p className={styles.error}>{errors.username}</p>}

//           <label>Email</label>
//           <input
//             type="email"
//             name="email"
//             placeholder="user@company.com"
//             value={form.email}
//             onChange={handleChange}
//           />
//           {errors.email && <p className={styles.error}>{errors.email}</p>}

//           <label>Password</label>
//           <input
//             type="password"
//             name="password"
//             placeholder="Enter password"
//             value={form.password}
//             onChange={handleChange}
//           />
//           {errors.password && <p className={styles.error}>{errors.password}</p>}
//           {errors.general && <p className={styles.error}>{errors.general}</p>}

//           <button type="submit" className={styles.primaryBtn}>
//             Register
//           </button>
//         </form>

//         <div className={styles.divider}>OR REGISTER WITH</div>

//         <div className={styles.socialButtons}>
//           <button className={styles.googleBtn}>Google</button>
//           <button className={styles.appleBtn}>Apple</button>
//         </div>

//         <p className={styles.switchText}>
//           Already have an account? <Link>Log In</Link>
//         </p>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSocket } from "../../context/SocketContext";

const ParticipantSession = () => {
  const socket = useSocket();
  const location = useLocation();
  const navigate = useNavigate();
  const { code, name } = location.state || {};

  const [polls, setPolls] = useState([]);
  const [responses, setResponses] = useState({});

  useEffect(() => {
    if (!code || !name) {
      navigate("/join"); // redirect if session info missing
    }
  }, [code, name, navigate]);

  useEffect(() => {
    if (!socket) return;

    socket.on("poll_published", (poll) => {
      setPolls((prev) => [...prev, poll]);
    });

    socket.on("poll_closed", (pollId) => {
      setPolls((prev) =>
        prev.map((p) => (p.id === pollId ? { ...p, status: "closed" } : p))
      );
    });

    return () => {
      socket.off("poll_published");
      socket.off("poll_closed");
    };
  }, [socket]);

  const handleVote = (pollId, option) => {
    if (!socket || !code || !name) return;
    setResponses({ ...responses, [pollId]: option });
    socket.emit("submit_response", { code, name, pollId, option });
  };

  if (!code || !name) return <p>Redirecting to join page...</p>;

  return (
    <div>
      <h1>Welcome, {name}</h1>
      <h2>Session Code: {code}</h2>

      {polls.length === 0 ? (
        <p>Waiting for host to publish polls...</p>
      ) : (
        polls.map((poll) => (
          <div key={poll.id}>
            <h3>{poll.question}</h3>
            {(poll.options || []).map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleVote(poll.id, opt)}
                disabled={responses[poll.id] === opt}
              >
                {opt}
              </button>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default ParticipantSession;
