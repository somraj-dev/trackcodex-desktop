import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./DesktopLogin.module.css";

export const HandshakeSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    // If we have a token, automatically try to redirect the browser to the deep link
    if (token) {
      window.location.href = `trackcodex://auth/callback?token=${token}`;
    }
  }, [token]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
        <h1 className={styles.title}>Authentication Complete</h1>
        <p className={styles.subtitle}>
          You have successfully authenticated TrackCodex Desktop.
        </p>
        
        <div style={{ padding: '16px', backgroundColor: '#1f2428', borderRadius: '6px', marginBottom: '24px' }}>
          <p style={{ margin: 0, fontSize: '14px' }}>
            You can now close this tab and return to the desktop application.
          </p>
        </div>

        <button 
          className={styles.button}
          onClick={() => {
            if (token) {
               window.location.href = `trackcodex://auth/callback?token=${token}`;
            }
          }}
        >
          Open TrackCodex Desktop
        </button>
      </div>
    </div>
  );
};
