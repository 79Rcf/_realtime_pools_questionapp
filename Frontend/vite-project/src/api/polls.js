import API from "./axiosInstance";

// helper for auth
const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
  },
});

// Create a poll dynamically
export const createPoll = async ({ question, options, sessionId }) => {
  if (!question || !options || !sessionId) {
    throw new Error("question, options, and sessionId are required");
  }

  try {
    const response = await API.post(
      "/polls",
      { question, options, session_id: sessionId },
      authHeaders()
    );
    return response.data; // ✅ this returns the full poll object including backend id
  } catch (error) {
    console.error("Error creating poll:", error.response?.data || error);
    throw error;
  }
};


// Update poll
export const updatePoll = async (pollId, data) => {
  try {
    const response = await API.put(`/polls/${pollId}`, data, authHeaders());
    return response.data;
  } catch (error) {
    console.error("Error updating poll:", error.response?.data || error);
    throw error;
  }
};

// Publish poll
export const publishPoll = async (pollId) => {
  try {
    const response = await API.patch(`/polls/${pollId}/publish`, {}, authHeaders());
    return response.data;
  } catch (error) {
    console.error("Error publishing poll:", error.response?.data || error);
    throw error;
  }
};

// Hide poll
export const hidePoll = async (pollId) => {
  try {
    const response = await API.patch(`/polls/${pollId}/hide`, {}, authHeaders());
    return response.data;
  } catch (error) {
    console.error("Error hiding poll:", error.response?.data || error);
    throw error;
  }
};

// Complete poll
export const completePoll = async (pollId) => {
  try {
    const response = await API.patch(`/polls/${pollId}/complete`, {}, authHeaders());
    return response.data;
  } catch (error) {
    console.error("Error completing poll:", error.response?.data || error);
    throw error;
  }
};

// Submit poll answer
export const pollAnswer = async (pollId, answer) => {
  try {
    const response = await API.post(`/pollsAnswer/${pollId}/answer`, { answer }, authHeaders());
    return response.data;
  } catch (error) {
    console.error("Error submitting answer:", error.response?.data || error);
    throw error;
  }
};
