import axios from "axios";
import { BASE_URL } from "./constants";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      // Add Authorization header
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config; // Proceed with the modified config
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

export default axiosInstance;
