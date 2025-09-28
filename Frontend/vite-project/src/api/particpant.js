import API from "./axiosInstance";

// participant submits an answer
export const submitAnswer = (pollId, data) =>
  API.post(`/participants/${pollId}/answers`, data);

// participant joins a session
export const joinSession = (data) =>
  API.post("/participants/join", data);
