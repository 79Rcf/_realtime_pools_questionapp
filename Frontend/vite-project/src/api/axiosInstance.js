import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  ("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
},
(error) => {
  return Promise.reject(error);
},);

API.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response && error.response.status === 401) {
    // Handle unauthorized access, e.g., redirect to login
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    console.log("Unauthorized, redirecting to login...");
  }
  return Promise.reject(error);
},);

export default API;
