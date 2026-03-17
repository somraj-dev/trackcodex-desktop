import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth, api } from "../../context/AuthContext";

const OAuthCallback: React.FC = () => {
  const { provider } = useParams<{ provider: "google" | "github" }>();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const hasRun = React.useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const handleCallback = async () => {
      try {
        const queryParams = new URLSearchParams(window.location.search);
        const code = queryParams.get("code");

        if (!code) {
          throw new Error("No authorization code received");
        }

        // Exchange code via backend API
        const endpoint = provider === "google" ? "/auth/google" : "/auth/github";
        const res = await api.post(endpoint, { code });

        // Login with response data
        login(res.data.user, res.data.csrfToken, res.data.sessionId);

        // Redirect to dashboard or saved path
        const redirectPath = localStorage.getItem("redirect_after_login") || "/dashboard/home";
        localStorage.removeItem("redirect_after_login");

        navigate(redirectPath);
      } catch (err: any) {
        console.error("OAuth callback error:", err);
        setError(err.response?.data?.error || err.message || "Authentication failed");
        setTimeout(() => navigate("/login"), 5000);
      }
    };

    handleCallback();
  }, [provider, navigate, login]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gh-bg text-gh-text-secondary">
        <div className="bg-gh-bg-secondary border border-red-500 rounded-lg p-8 max-w-md text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-xl font-bold mb-2 text-red-400">
            Authentication Failed
          </h1>
          <p className="text-gh-text-secondary mb-4">{error}</p>
          <p className="text-sm text-gh-text-secondary">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gh-bg text-gh-text-secondary">
      <div className="bg-gh-bg-secondary border border-gh-border rounded-lg p-8 max-w-md text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
        <h1 className="text-xl font-bold mb-2">Completing Sign In</h1>
        <p className="text-gh-text-secondary">
          Authenticating with {provider === "google" ? "Google" : "GitHub"}...
        </p>
      </div>
    </div>
  );
};

export default OAuthCallback;
