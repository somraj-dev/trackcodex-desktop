import { useState, useEffect } from "react";

interface DesktopAuthHook {
  isAuthenticated: boolean;
  token: string | null;
  user: any | null;
  status: "idle" | "waiting_for_browser" | "authenticating" | "authenticated" | "error";
  error: string | null;
  initiateLogin: () => Promise<void>;
  logout: () => void;
  isDesktop: boolean;
}

export function useDesktopAuth(): DesktopAuthHook {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [status, setStatus] = useState<DesktopAuthHook["status"]>("idle");
  const [error, setError] = useState<string | null>(null);
  
  // Check if we are running in Electron
  const isDesktop = typeof window !== "undefined" && !!(window as any).electron?.platform?.isDesktop;

  useEffect(() => {
    if (!isDesktop) return;

    const electron = (window as any).electron;

    // 1. Initial load - check if we already have a token
    const storedToken = electron.auth.getToken();
    if (storedToken) {
      setToken(storedToken);
      setStatus("authenticated");
      // Could fetch user info here using the token
    }

    // 2. Listen for auth success deep link callback
    electron.auth.onAuthSuccess((sessionId: string) => {
      console.log("Deep link authenticated with session", sessionId);
      setToken(sessionId);
      setStatus("authenticated");
      electron.auth.setToken(sessionId);
    });
    
    // Legacy support
    electron.onAuthToken((t: string) => {
       console.log("Deep link authenticated with legacy auth token");
       setToken(t);
       setStatus("authenticated");
       electron.auth.setToken(t);
    });

  }, [isDesktop]);

  const initiateLogin = async () => {
    try {
      setStatus("waiting_for_browser");
      setError(null);

      // BYPASS: Skip browser handshake, authenticate immediately
      await new Promise((r) => setTimeout(r, 800)); // Brief animation delay
      const bypassToken = "desktop-bypass-" + Date.now();
      setToken(bypassToken);
      setStatus("authenticated");

      // Persist the bypass token if running in Electron
      if (isDesktop && (window as any).electron?.auth?.setToken) {
        (window as any).electron.auth.setToken(bypassToken);
      }
    } catch (err: any) {
      setStatus("error");
      setError(err.message || "Failed to start login");
    }
  };

  const logout = () => {
    if (!isDesktop) return;
    setToken(null);
    setUser(null);
    setStatus("idle");
    (window as any).electron.auth.clearToken();
  };

  return {
    isAuthenticated: !!token,
    token,
    user,
    status,
    error,
    initiateLogin,
    logout,
    isDesktop
  };
}
