import API from "../api/axiosInstance";

// Create session
API.post("/sessions", { title: "My First Session" })
  .then(res => console.log("Create Session:", res.data));

// Get sessions
API.get("/sessions")
  .then(res => console.log("All Sessions:", res.data));
