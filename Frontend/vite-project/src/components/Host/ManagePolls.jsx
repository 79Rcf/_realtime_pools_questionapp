// src/components/Host/ManagePoll.jsx
import React, { useEffect, useState } from 'react';
import PollList from '../Poll/PollList';
import { useSocket } from '../../context/SocketContext';

const ManagePoll = () => {
  const socket = useSocket();
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    // Fetch polls initially (replace with your fetch logic or API)
    const fetchInitialPolls = async () => {
      // Example dummy initial polls; replace with API call
      setPolls([
        { id: 1, question: 'Example Poll 1', options: ['Yes', 'No'], status: 'draft' },
        { id: 2, question: 'Example Poll 2', options: ['A', 'B', 'C'], status: 'published' }
      ]);
    };

    fetchInitialPolls();

    if (!socket) return;

    socket.on('pollResponse', (response) => {
      // Handle real-time poll response update here
      console.log('Poll response received:', response);
    });

    return () => {
      socket.off('pollResponse');
    };
  }, [socket]);

  const publishPoll = (pollId) => {
    setPolls((prev) =>
      prev.map((p) => (p.id === pollId ? { ...p, status: 'published' } : p))
    );
    socket.emit('publishPoll', { pollId });
  };

  const closePoll = (pollId) => {
    setPolls((prev) =>
      prev.map((p) => (p.id === pollId ? { ...p, status: 'closed' } : p))
    );
    socket.emit('closePoll', { pollId });
  };

  return (
    <div>
      <h2>Manage Polls</h2>
      <PollList polls={polls} onPublish={publishPoll} onClose={closePoll} />
    </div>
  );
};

export default ManagePoll;
