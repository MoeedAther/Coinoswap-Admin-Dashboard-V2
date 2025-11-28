import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

// Create axios instance with default config for session-based auth
const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Important for session cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Login Admin
export const loginAdmin = async (formData) => {
  const response = await apiClient.post("/admin/login", formData);
  return response.data;
};

// Logout Admin
export const logoutAdmin = async () => {
  const response = await apiClient.post("/admin/logout");
  return response.data;
};

// Get Session
export const getSession = async () => {
  const response = await apiClient.get("/admin/session");
  return response.data;
};

// Change Password
export const changePassword = async (formData) => {
  const response = await apiClient.post("/admin/change-password", formData);
  return response.data;
};

// Enable 2FA
export const enable2FA = async () => {
  const response = await apiClient.post("/admin/2fa/enable");
  return response.data;
};

// Verify 2FA
export const verify2FA = async (formData) => {
  const response = await apiClient.post("/admin/2fa/verify", formData);
  return response.data;
};

// Disable 2FA
export const disable2FA = async (formData) => {
  const response = await apiClient.post("/admin/2fa/disable", formData);
  return response.data;
};

