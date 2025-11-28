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

// Get All Settings
export const getAllSettings = async () => {
  const response = await apiClient.get("/admin/settings");
  return response.data;
};

// Get Setting by Key
export const getSettingByKey = async (key) => {
  const response = await apiClient.get(`/admin/settings/${key}`);
  return response.data;
};

// Create or Update Setting (Upsert)
export const upsertSetting = async (formData) => {
  const response = await apiClient.post("/admin/settings", formData);
  return response.data;
};

// Delete Setting
export const deleteSetting = async (key) => {
  const response = await apiClient.delete(`/admin/settings/${key}`);
  return response.data;
};

