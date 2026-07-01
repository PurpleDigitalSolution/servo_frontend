import axios from "axios";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});
api.defaults.withCredentials = true;

const publicRoutes = [
  "/",
  "/result-checker",
  "/auth/login",
  "/auth/register",
  "/auth/forget-password",
  "/auth/reset-password",
];
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || "An error occurred";
    const currentPath = window.location.pathname;

    // Unauthorized access - token might be expired or invalid
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("accessToken");
      useAuthStore.getState().reset();
      if (!publicRoutes.includes(currentPath)) {
        toast.error(message || "Session expired. Please log in again.");
        window.location.href = "/auth/login";
      }
      return Promise.reject(error);
    }

    // Forbidden
    if (status === 403) {
      useAuthStore.getState().reset();
      if (!publicRoutes.includes(currentPath)) {
        window.location.href = "/auth/login";
      }
      toast.error(
        message || "You don't have permission to perform this action.",
      );
    }
    return Promise.reject(error);
  },
);

export default api;
