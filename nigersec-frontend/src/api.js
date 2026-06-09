import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function unwrapResponse(response) {
  const payload = response?.data;
  if (!payload) {
    throw new Error("No response from server");
  }
  if (!payload.success) {
    throw new Error(payload.error || payload.message || "Request failed");
  }
  return payload.data;
}

export async function login(email, password) {
  const response = await api.post("/auth/login", { email, password });
  return unwrapResponse(response);
}

export async function logout() {
  const response = await api.post("/auth/logout");
  return unwrapResponse(response);
}

export default api;
