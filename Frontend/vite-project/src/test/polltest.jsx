import { createPoll, getPolls, getPollById, publishPoll, completePoll } from "../api/poll";

// Create poll
createPoll({
  question: "Favorite color?",
  options: ["Red", "Blue", "Green"],
  session_id: 1
}).then(res => console.log("Create Poll:", res.data));

// Get all polls
getPolls().then(res => console.log("Polls:", res.data));

// Get specific poll by ID
getPollById(1).then(res => console.log("Poll by ID:", res.data));

// Publish a poll
publishPoll(1).then(res => console.log("Publish:", res.data));

// Complete a poll
completePoll(1).then(res => console.log("Complete:", res.data));
