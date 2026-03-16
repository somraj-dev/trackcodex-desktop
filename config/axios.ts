import axios from "axios";
import { API_BASE_URL } from "./api";

// Create a centralized instance
export const apiAxios = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // For cookie-based auth on Web
});

// Request interceptor to attach Desktop token if available
apiAxios.interceptors.request.use(
  (config) => {
    // 1. CSRF Token
    const csrfToken = localStorage.getItem("csrf_token");
    if (csrfToken) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }

    // 2. Desktop Bearer Token
    let token = localStorage.getItem("session_id");
    const isDesktop = typeof window !== "undefined" && !!(window as any).electron?.platform?.isDesktop;
    
    if (isDesktop && (window as any).electron?.auth?.getToken) {
      token = (window as any).electron.auth.getToken() || token;
    }

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiAxios;
