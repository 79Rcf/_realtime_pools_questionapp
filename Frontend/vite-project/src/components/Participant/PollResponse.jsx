import React, { useState } from 'react';
import { useSocket } from '../../context/SocketContext';

const PollResponse = ({ poll }) => {
  const socket = useSocket();
  const [selectedOption, setSelectedOption] = useState(null);

  const submitResponse = () => {
    if (selectedOption) {
      socket.emit('submitResponse', { pollId: poll.id, answer: selectedOption });
    }
  };

  return (
    <div>
      <h3>{poll.question}</h3>
      {poll.options.map((option, index) => (
        <label key={index} style={{ display: 'block' }}>
          <input
            type="radio"
            name={`poll-${poll.id}`}
            value={option}
            checked={selectedOption === option}
            onChange={() => setSelectedOption(option)}
          />
          {option}
        </label>
      ))}
      <button onClick={submitResponse} disabled={!selectedOption}>
        Submit Response
      </button>
    </div>
  );
};

export default PollResponse;
