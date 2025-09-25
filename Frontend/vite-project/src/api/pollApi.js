// src/api/pollApi.js

const API_BASE_URL = 'http://localhost:3000/api'; // Adjust to your backend URL

// Fetch polls for a given session code
export const fetchPolls = async (sessionCode) => {
  const response = await fetch(`${API_BASE_URL}/polls?sessionCode=${sessionCode}`);

  if (!response.ok) {
    throw new Error('Failed to fetch polls');
  }

  return response.json();
};

// Create a new poll with provided poll data
export const createPoll = async (pollData) => {
  const response = await fetch(`${API_BASE_URL}/polls`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pollData),
  });

  if (!response.ok) {
    throw new Error('Failed to create poll');
  }

  return response.json();
};

// Update a specific poll by ID with partial updates (e.g., status)
export const updatePoll = async (pollId, updates) => {
  const response = await fetch(`${API_BASE_URL}/polls/${pollId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error('Failed to update poll');
  }

  return response.json();
};

// Delete a poll by ID
export const deletePoll = async (pollId) => {
  const response = await fetch(`${API_BASE_URL}/polls/${pollId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete poll');
  }

  return response.json();
};
