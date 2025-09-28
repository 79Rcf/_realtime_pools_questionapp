import API from "./axiosInstance";

// host creates poll
export const createPoll = (data) => API.post("/polls", data);

// host updates poll
export const updatePoll = (id, data) => API.put(`/polls/${id}`, data);

// publish poll
export const publishPoll = (id) => API.put(`/polls/${id}/publish`);

// hide poll
export const hidePoll = (id) => API.put(`/polls/${id}/hide`);

// complete poll
export const completePoll = (id) => API.put(`/polls/${id}/complete`);

// get all polls (optional filter by status)
export const getPolls = (status) =>
  API.get(`/polls${status ? `?status=${status}` : ""}`);

// get poll by id
export const getPollById = (id) => API.get(`/polls/${id}`);

// get polls for a session (published only)
export const getSessionPolls = (sessionId) => API.get(`/polls/session/${sessionId}`);
