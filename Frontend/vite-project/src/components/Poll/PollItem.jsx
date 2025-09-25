import React from "react";

const PollItem = ({ poll, onPublish, onClose }) => {
  return (
    <div>
      <h3>{poll.question}</h3>
      <ul>
        {poll.options.map((opt, idx) => (
          <li key={idx}>{opt}</li>
        ))}
      </ul>
      <p>Status: {poll.status}</p>
      {poll.status === "draft" && (
        <button onClick={() => onPublish(poll.id)}>Publish</button>
      )}
      {poll.status === "published" && (
        <button onClick={() => onClose(poll.id)}>Close</button>
      )}
    </div>
  );
};

export default PollItem;
