import React from "react";
import { useDesktopAuth } from "../hooks/useDesktopAuth";
import styles from "./DesktopLogin.module.css";

export const DesktopLogin: React.FC = () => {
  const { status, error, initiateLogin, logout } = useDesktopAuth();

  const handleCancel = () => {
    // Reset state by calling logout which clears everything
    logout();
  };

  return (
    <div className={styles.handshakePage}>
      {/* Animated background glow */}
      <div className={styles.bgGlow} />
      <div className={styles.gridOverlay} />

      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logoContainer}>
          <div className={styles.logoIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
              <line x1="12" y1="2" x2="12" y2="22" opacity="0.3" />
            </svg>
          </div>
        </div>

        {/* Brand */}
        <span className={styles.brandName}>TrackCodex</span>
        <h1 className={styles.title}>Desktop</h1>
        <p className={styles.subtitle}>
          Authenticate securely using your TrackCodex account
          through your browser — no passwords entered here.
        </p>

        {/* ── Idle / Error State ── */}
        {(status === "idle" || status === "error") && (
          <>
            <button
              className={styles.handshakeButton}
              onClick={() => void initiateLogin()}
            >
              <svg className={styles.buttonIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              Initiate Handshake
            </button>
            {error && <p className={styles.errorText}>{error}</p>}
          </>
        )}

        {/* ── Waiting for browser ── */}
        {(status === "waiting_for_browser" || status === "authenticating") && (
          <div className={styles.waitingContainer}>
            <div className={styles.pulseRing}>
              <div className={styles.pulseCore} />
            </div>
            <p className={styles.waitingText}>Waiting for handshake…</p>
            <p className={styles.waitingHint}>
              Complete authentication in your browser
            </p>
            <button
              className={styles.cancelButton}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        )}

        {/* ── Authenticated ── */}
        {status === "authenticated" && (
          <div className={styles.successContainer}>
            <div className={styles.successIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className={styles.successTitle}>Handshake Complete</h2>
            <p className={styles.successSubtitle}>Loading your workspace…</p>
          </div>
        )}

        {/* ── Footer ── */}
        <div className={styles.footer}>
          <div className={styles.footerDivider} />
          <span className={styles.footerText}>
            Secure digital handshake powered by TrackCodex
          </span>
          <span className={styles.version}>v0.1.13</span>
        </div>
      </div>
    </div>
  );
};

export default DesktopLogin;
