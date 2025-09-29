import React, { useState } from "react";
import axios from "axios";
import styles from "./CreatePoll.module.css";

const CreatePoll = ({ token }) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [sessionId, setSessionId] = useState("");
  const [message, setMessage] = useState("");

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:3000/api/polls",
        { question, options, session_id: sessionId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Poll created successfully!");
      console.log(res.data);
    } catch (err) {
      setMessage("Error creating poll");
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Create Poll</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>Question</label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />

        <label>Session ID</label>
        <input
          type="text"
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
          required
        />

        <label>Options</label>
        {options.map((opt, idx) => (
          <input
            key={idx}
            type="text"
            value={opt}
            onChange={(e) => handleOptionChange(idx, e.target.value)}
            required
          />
        ))}
        <button type="button" onClick={addOption}>
          + Add Option
        </button>

        <button type="submit">Create Poll</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreatePoll;
