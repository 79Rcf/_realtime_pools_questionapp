import React, { useState, useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';


const HostDashboard = () => {
  const socket = useSocket();
  const [polls, setPolls] = useState([]);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);

  useEffect(() => {
    if (!socket) return;

    socket.on('pollResponse', (response) => {
      // Implement response handling logic here as needed
      console.log('Poll response received', response);
    });

    return () => socket.off('pollResponse');
  }, [socket]);

  const addOption = () => setOptions([...options, '']);
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
      status: 'draft',
    };
    setPolls([...polls, newPoll]);
    setQuestion('');
    setOptions(['', '']);
  };

  const publishPoll = (id) => {
    setPolls(
      polls.map((p) => (p.id === id ? { ...p, status: 'published' } : p))
    );
    socket.emit('publishPoll', { pollId: id });
  };

  const closePoll = (id) => {
    setPolls(
      polls.map((p) => (p.id === id ? { ...p, status: 'closed' } : p))
    );
    socket.emit('closePoll', { pollId: id });
  };

  return (
    <div>
      <h2>Host Dashboard</h2>
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
            <strong>{poll.question}</strong> ({poll.status}){' '}
            {poll.status === 'draft' && (
              <button onClick={() => publishPoll(poll.id)}>Publish</button>
            )}
            {poll.status === 'published' && (
              <button onClick={() => closePoll(poll.id)}>Close</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HostDashboard;
