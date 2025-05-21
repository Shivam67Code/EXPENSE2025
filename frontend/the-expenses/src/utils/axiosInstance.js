import axios from "axios";
import { BASE_URL } from "./apiPaths";

// Add console log to check if BASE_URL is being set correctly
console.log("API Base URL:", BASE_URL);

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  }
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    // Add logging to debug token issues
    console.log("Token from localStorage:", accessToken ? "exists" : "not found");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      console.log("Authorization header set:", `Bearer ${accessToken.substring(0, 10)}...`);
    } else {
      console.log("No token found, request will be unauthenticated");
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors globally
    if (error.response) {
      console.error("API Error:", error.response.status, error.response.data);

      if (error.response.status === 401) {
        console.log("Unauthorized - clearing token and redirecting to login");
        localStorage.removeItem("token"); // Clear the invalid token
        // Only redirect to login if we're not already on the login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = "/login";
        }
      } else if (error.response.status === 500) {
        console.error("Server error. Please try again later.");
      }
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timeout. Please try again.");
    } else {
      console.error("Network error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;