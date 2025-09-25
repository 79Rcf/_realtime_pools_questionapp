// // import React from "react";
// // import { useAuth } from "../context/AuthContext";
// // import { Formik, Form, Field, ErrorMessage } from "formik";
// // import * as Yup from "yup";

// // const Login = () => {
// //   const { login } = useAuth();

// //   // ✅ Validation schema
// //   const validationSchema = Yup.object({
// //     email: Yup.string()
// //       .email("Invalid email format")
// //       .required("Email is required"),
// //     password: Yup.string()
// //       .min(6, "Password must be at least 6 characters")
// //       .required("Password is required"),
// //   });

// //   // ✅ Initial form values
// //   const initialValues = {
// //     email: "",
// //     password: "",
// //   };

// //   // ✅ Submit handler
// //   const handleSubmit = async (values, { setSubmitting }) => {
// //     await login(values.email, values.password);
// //     setSubmitting(false);
// //   };

// //   return (
// //     <div>
// //       <h2>Host Login</h2>
// //       <Formik
// //         initialValues={initialValues}
// //         validationSchema={validationSchema}
// //         onSubmit={handleSubmit}
// //       >
// //         {({ isSubmitting }) => (
// //           <Form>
// //             <div>
// //               <Field type="email" name="email" placeholder="Email" />
// //               <ErrorMessage
// //                 name="email"
// //                 component="div"
// //                 style={{ color: "red", fontSize: "0.9em" }}
// //               />
// //             </div>

// //             <div>
// //               <Field type="password" name="password" placeholder="Password" />
// //               <ErrorMessage
// //                 name="password"
// //                 component="div"
// //                 style={{ color: "red", fontSize: "0.9em" }}
// //               />
// //             </div>

// //             <button type="submit" disabled={isSubmitting}>
// //               {isSubmitting ? "Logging in..." : "Login"}
// //             </button>
// //           </Form>
// //         )}
// //       </Formik>
// //     </div>
// //   );
// // };

// // export default Login;

// import React, { useState, useEffect } from "react";
// // import { useSocket } from "../../context/SocketContext";
// // import PollList from "../../components/PollList";
// import PollList from "../../components/Poll/PollList";
// import Navbar from "../../components/Poll/Navbar";

// const HostDashboard = () => {
//   const socket = useSocket();
//   const [polls, setPolls] = useState([]);
//   const [question, setQuestion] = useState("");
//   const [options, setOptions] = useState(["", ""]);

//   useEffect(() => {
//     if (!socket) return;

//     socket.on("pollResponse", (response) => {
//       console.log("Poll response received", response);
//     });

//     return () => socket.off("pollResponse");
//   }, [socket]);

//   const addOption = () => setOptions([...options, ""]);
//   const updateOption = (index, value) => {
//     const updated = [...options];
//     updated[index] = value;
//     setOptions(updated);
//   };

//   const createPoll = () => {
//     const newPoll = {
//       id: Date.now(),
//       question,
//       options,
//       status: "draft",
//     };
//     setPolls([...polls, newPoll]);
//     setQuestion("");
//     setOptions(["", ""]);
//   };

//   const publishPoll = (id) => {
//     setPolls(polls.map((p) => (p.id === id ? { ...p, status: "published" } : p)));
//     socket.emit("publishPoll", polls.find((p) => p.id === id));
//   };

//   const closePoll = (id) => {
//     setPolls(polls.map((p) => (p.id === id ? { ...p, status: "closed" } : p)));
//     socket.emit("closePoll", { pollId: id });
//   };

//   return (
//     <div>
//   <Navbar />
//       <h2>Host Dashboard</h2>
//       <div>
//         <input
//           placeholder="Poll question"
//           value={question}
//           onChange={(e) => setQuestion(e.target.value)}
//         />
//         {options.map((opt, i) => (
//           <input
//             key={i}
//             placeholder={`Option ${i + 1}`}
//             value={opt}
//             onChange={(e) => updateOption(i, e.target.value)}
//           />
//         ))}
//         <button onClick={addOption}>Add Option</button>
//         <button onClick={createPoll}>Create Poll (Draft)</button>
//       </div>

//       <ul>
//         {polls.map((poll) => (
//           <li key={poll.id}>
//             <strong>{poll.question}</strong> ({poll.status}){" "}
//             {poll.status === "draft" && (
//               <button onClick={() => publishPoll(poll.id)}>Publish</button>
//             )}
//             {poll.status === "published" && (
//               <button onClick={() => closePoll(poll.id)}>Close</button>
//             )}
//           </li>
//         ))}
//       </ul>

//       <h3>Polls List</h3>
//       <PollList polls={polls} onVote={() => {}} />
//     </div>
//   );
// };

// export default HostDashboard;

import React, { useState, useEffect } from "react";
import { useSocket } from "../../context/SocketContext";
import { useLocation, useNavigate } from "react-router-dom";

const HostDashboard = () => {
  const socket = useSocket();
  const location = useLocation();
  const navigate = useNavigate();

  // Receive host email from JoinSession
  const { email } = location.state || {};

  const [polls, setPolls] = useState([]);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);

  useEffect(() => {
    if (!email) {
      navigate("/"); // redirect home if no host info
    }
  }, [email, navigate]);

  // Listen for participant responses
  useEffect(() => {
    if (!socket) return;

    socket.on("pollResponse", (response) => {
      console.log("Poll response received:", response);
    });

    return () => socket.off("pollResponse");
  }, [socket]);

  const addOption = () => setOptions([...options, ""]);
  const updateOption = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const createPoll = () => {
    const newPoll = {
      id: Date.now(),
      question,
      options,
      status: "draft",
      hostEmail: email, // link poll to this host
    };
    setPolls([...polls, newPoll]);
    setQuestion("");
    setOptions(["", ""]);
  };

  const publishPoll = (id) => {
    const poll = polls.find((p) => p.id === id);
    setPolls(
      polls.map((p) => (p.id === id ? { ...p, status: "published" } : p))
    );
    socket?.emit("publish_poll", poll); // send poll to server
  };

  const closePoll = (id) => {
    setPolls(
      polls.map((p) => (p.id === id ? { ...p, status: "closed" } : p))
    );
    socket?.emit("close_poll", { pollId: id, hostEmail: email });
  };

  return (
    <div>
      <h2>Host Dashboard</h2>
      <p>Logged in as: {email}</p>

      <div>
        <input
          placeholder="Poll question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        {options.map((opt, i) => (
          <input
            key={i}
            placeholder={`Option ${i + 1}`}
            value={opt}
            onChange={(e) => updateOption(i, e.target.value)}
          />
        ))}
        <button onClick={addOption}>Add Option</button>
        <button onClick={createPoll}>Create Poll (Draft)</button>
      </div>

      <ul>
        {polls.map((poll) => (
          <li key={poll.id}>
            <strong>{poll.question}</strong> ({poll.status}){" "}
            {poll.status === "draft" && (
              <button onClick={() => publishPoll(poll.id)}>Publish</button>
            )}
            {poll.status === "published" && (
              <button onClick={() => closePoll(poll.id)}>Close</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HostDashboard;
