import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RedirectAfterAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Read the intended destination or default to home
    const redirectPath = localStorage.getItem("redirect_after_login") || "/dashboard/home";
    localStorage.removeItem("redirect_after_login");

    // Redirect safely replacing the auth URL in history
    navigate(redirectPath, { replace: true });
  }, [navigate]);

  return null;
};

export default RedirectAfterAuth;
