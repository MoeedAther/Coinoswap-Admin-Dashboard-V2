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

// Search Coins
export const searchCoins = async (params) => {
  const queryParams = new URLSearchParams(params).toString();
  const response = await apiClient.get(`/buy/search-coins?${queryParams}`);
  return response.data;
};

// Create or Delete Standard Coin
export const createOrDeleteStandardCoin = async (formData) => {
  const response = await apiClient.post("/buy/create-standard-coin", formData);
  return response.data;
};

