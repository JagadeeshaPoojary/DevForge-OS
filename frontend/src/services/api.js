import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Prevent duplicate connection-error toasts
let connectionToastShown = false;
let connectionToastTimer = null;
let authenticationToastShown = false;

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Reset connection error state
    connectionToastShown = false;

    return response;
  },

  (error) => {
    // 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem("token");

      if (!authenticationToastShown) {
        authenticationToastShown = true;

        toast.error(
          error.response?.data?.message ||
            "Please sign in to load your dashboard data."
        );

        // Allow authentication toast again after 5 seconds
        setTimeout(() => {
          authenticationToastShown = false;
        }, 5000);
      }
    }

    // 500+ Server Error
    else if (error.response?.status >= 500) {
      toast.error("Server error. Please try again.");
    }

    // Backend unavailable
    else if (!error.response) {
      if (!connectionToastShown) {
        connectionToastShown = true;

        toast.error("Unable to connect to server.");

        clearTimeout(connectionToastTimer);

        connectionToastTimer = setTimeout(() => {
          connectionToastShown = false;
        }, 5000);
      }
    }

    return Promise.reject(error);
  }
);

export default api;