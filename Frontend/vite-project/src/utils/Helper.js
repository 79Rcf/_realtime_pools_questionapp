// src/utils/helpers.js

// Generate a unique ID (e.g., for creating new polls locally before saved in DB)
export const generateUniqueId = () => Date.now().toString();

// Format a date string nicely (optional formatting example)
export function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

// Validate email format (simple regex)
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Validate poll option text (non-empty string)
export function isValidOption(option) {
  return option.trim().length > 0;
}
