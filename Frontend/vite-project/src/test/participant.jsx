import { joinSession, submitAnswer } from "../api/particpant";

// Join session
joinSession({ code: "SESSION123", name: "Participant1" })
  .then(res => console.log("Join Session:", res.data));

// Submit poll answer
submitAnswer(1, { participant_id: 1, answer: "Blue" })
  .then(res => console.log("Submit Answer:", res.data));
