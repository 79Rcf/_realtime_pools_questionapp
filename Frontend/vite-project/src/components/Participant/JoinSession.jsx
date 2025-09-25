import React, { useState } from 'react';
import { useSocket } from '../../context/SocketContext';

const JoinSession = ({ onJoined }) => {
  const socket = useSocket();
  const [sessionCode, setSessionCode] = useState('');
  const [name, setName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');

  const join = () => {
    if (sessionCode && name && emailOrPhone) {
      socket.emit('joinSession', { sessionCode, name, emailOrPhone });
      onJoined && onJoined();
    }
  };

  return (
    <div>
      <input
        placeholder="Session Code"
        value={sessionCode}
        onChange={(e) => setSessionCode(e.target.value)}
      />
      <input
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Email or Phone"
        value={emailOrPhone}
        onChange={(e) => setEmailOrPhone(e.target.value)}
      />
      <button onClick={join}>Join Session</button>
    </div>
  );
};

export default JoinSession;
