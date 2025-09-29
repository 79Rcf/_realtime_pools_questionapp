import axios from "axios";

const API = "http://localhost:3000/api";

/* creating polls */

export const createPoll = async ({ question, options, sessionId }) => {
  try {
    const response = await axios.post(`${API}/polls`, {
      question,
      options,
      sessionId
    });
    return response.data;
  } catch (error) {
    console.error("Error creating poll:", error);
    throw error;
  }
};


export const publishPoll = async (pollId) => {
  const response = await axios.post(`${API}/polls/${pollId}/publish`);
  return response.data;
};

export const updatePoll = async (pollId) => {
    const response = await axios.put(`${API}/polls/${pollId}`);
    return response.data;
}

export const completePoll = async (pollId) => {
    const response = await axios.post(`${API}/polls/${pollId}/complete`);
    return response.data;
}

export const hidePoll = async (pollId) => {
    const response = await axios.post(`${API}/polls/${pollId}/hide`);
    return response.data;
}

export const pollAnswer = async (pollId, answer) => {
    const response = await axios.post(`${API}/polls/${pollId}/answer`, { answer });
    return response.data;
}