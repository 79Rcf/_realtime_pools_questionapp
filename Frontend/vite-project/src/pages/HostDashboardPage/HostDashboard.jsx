import React, { useEffect, useState } from "react";

const HostDashboard = () => {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    getPolls().then((res) => setPolls(res.data.polls));
  }, []);

  const handleCreate = async () => {
    const newPoll = {
      question: "What is your favorite JS framework?",
      options: ["React", "Vue", "Angular"],
      session_id: 1, // example session
    };
    await createPoll(newPoll);
    const updated = await getPolls();
    setPolls(updated.data.polls);
  };

  const handlePublish = async (id) => {
    await publishPoll(id);
    const updated = await getPolls();
    setPolls(updated.data.polls);
  };

  return (
    <div>
      <h1>Host Dashboard</h1>
      <button onClick={handleCreate}>Create Poll</button>
      <ul>
        {polls.map((poll) => (
          <li key={poll.id}>
            {poll.question} - {poll.status}
            {poll.status === "draft" && (
              <button onClick={() => handlePublish(poll.id)}>Publish</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HostDashboard;
