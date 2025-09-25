import React from "react";
import PollItem from "./PollItem";

const PollList = ({ polls, onPublish, onClose }) => {
  return (
    <div>
      <h2>All Polls</h2>
      {polls.length === 0 ? (
        <p>No polls yet.</p>
      ) : (
        polls.map((poll) => (
          <PollItem
            key={poll.id}
            poll={poll}
            onPublish={onPublish}
            onClose={onClose}
          />
        ))
      )}
    </div>
  );
};

export default PollList;
