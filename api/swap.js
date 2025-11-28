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

// Search Coins for Swap
export const searchSwapCoins = async (params) => {
  // Always include all parameters in the correct order, even if empty
  const queryParams = new URLSearchParams();
  
  // Add searchTerm (always include, even if empty string)
  // Use String() to ensure it's always a string, even if undefined/null
  const searchTerm = params?.searchTerm !== undefined && params?.searchTerm !== null 
    ? String(params.searchTerm) 
    : "";
  queryParams.append("searchTerm", searchTerm);
  
  // Add isStandard (required)
  queryParams.append("isStandard", String(params?.isStandard ?? 0));
  
  // Add page (default to 1)
  queryParams.append("page", String(params?.page ?? 1));
  
  // Add limit (default to 10)
  queryParams.append("limit", String(params?.limit ?? 10));
  
  const url = `/swap/search-coins?${queryParams.toString()}`;
  const fullUrl = `${apiClient.defaults.baseURL}${url}`;
  console.log("Swap API - Full URL:", fullUrl);
  console.log("Swap API - Query String:", queryParams.toString());
  const response = await apiClient.get(url);
  return response.data;
};

// Update Standard Coin
export const updateStandardCoin = async (formData) => {
  const response = await apiClient.post("/swap/update-coin", formData);
  return response.data;
};

// Merge Coins to Mapped Partners
export const mergeCoinsToMapped = async (formData) => {
  const response = await apiClient.post("/swap/merge-coins-to-mapped", formData);
  return response.data;
};

// Update Notifications
export const updateNotifications = async (formData) => {
  const response = await apiClient.post("/swap/update-notifications", formData);
  return response.data;
};
