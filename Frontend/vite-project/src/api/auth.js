import API from "./axiosInstance";

// signup
export const signUp = (data) => API.post("/auth/signUp", data);

// signin
export const signIn = (data) => API.post("/auth/signIn", data);
