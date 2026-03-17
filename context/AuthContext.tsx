import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import { profileService } from "../services/profile";

interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  avatar?: string;
  role: string;
  bio?: string;
  company?: string;
  location?: string;
  website?: string;
  followers?: number;
  following?: number;
  createdAt?: string;
  profileReadme?: string;
  resumeUrl?: string;
  resumeFilename?: string;
  resumeUploadedAt?: string;
  showResume?: boolean;
  showReadme?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User, csrfToken: string, sessionId?: string) => void;
  logout: () => void;
  csrfToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create axios instance with credentials support
console.log("[AuthContext] API_BASE_URL:", API_BASE_URL);
console.log(
  "[AuthContext] import.meta.env.VITE_API_URL:",
  import.meta.env.VITE_API_URL,
);
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Essential for sending Cookies
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [csrfToken, setCsrfToken] = useState<string | null>(
    localStorage.getItem("csrf_token"),
  );
  const [isLoading, setIsLoading] = useState(true);

  // Check session on mount via backend /auth/me
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await api.get("/auth/me");
        if (res.data?.user) {
          setUser(res.data.user);
          setCsrfToken(res.data.csrfToken || null);
          profileService.initFromAuth(res.data.user);
        }
      } catch {
        // Not authenticated — that's fine
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  // Configure axios interceptor to attach Session ID
  useEffect(() => {
    const interceptor = api.interceptors.request.use(async (config) => {
      // CSRF token is needed for state-changing requests
      if (
        ["post", "put", "delete", "patch"].includes(
          config.method?.toLowerCase() || "",
        ) &&
        csrfToken
      ) {
        config.headers["X-CSRF-Token"] = csrfToken;
      }

      // Attach session ID from localStorage
      const sessionId = localStorage.getItem("session_id");
      if (sessionId) {
        config.headers["Authorization"] = `Bearer ${sessionId}`;
      }

      return config;
    });

    return () => api.interceptors.request.eject(interceptor);
  }, [csrfToken]);

  const login = (userData: User, token: string, sessionId?: string) => {
    setUser(userData);
    setCsrfToken(token);
    if (token) localStorage.setItem("csrf_token", token);
    if (sessionId) localStorage.setItem("session_id", sessionId);
    profileService.initFromAuth(userData);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setUser(null);
      setCsrfToken(null);
      localStorage.removeItem("csrf_token");
      localStorage.removeItem("session_id");
      profileService.clearProfile();
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        csrfToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
