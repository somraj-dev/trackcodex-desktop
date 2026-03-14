import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../../styles/LegalPage.css"; // Reuse existing styles

const Contact = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = "https://support.trackcodex.com";
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="legal-page-container">
      <div 
        className="legal-content"
        style={{
          background: "rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          borderRadius: "24px",
          padding: "3rem",
          maxWidth: "700px",
          margin: "4rem auto",
          textAlign: "center",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Decorative background glow */}
        <div style={{
          position: "absolute",
          top: "-50%",
          left: "-50%",
          width: "200%",
          height: "200%",
          background: "radial-gradient(circle at center, rgba(59, 130, 246, 0.05) 0%, transparent 50%)",
          pointerEvents: "none",
          zIndex: 0
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <h1 style={{ 
            fontSize: "2.5rem", 
            fontWeight: 800, 
            marginBottom: "1.5rem",
            background: "linear-gradient(to right, #fff, #94a3b8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Contact TrackCodex
          </h1>
          
          <p style={{ fontSize: "1.1rem", color: "#94a3b8", marginBottom: "2.5rem", lineHeight: "1.6" }}>
            We've streamlined our communication. Our new Support Portal is the fastest way to get in touch for technical help, feature requests, or business inquiries.
          </p>

          <div 
            style={{ 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              gap: "1.5rem" 
            }}
          >
            <div style={{ 
              padding: "1rem 2rem", 
              background: "rgba(59, 130, 246, 0.1)", 
              borderRadius: "12px",
              border: "1px solid rgba(59, 130, 246, 0.2)",
              color: "#60a5fa",
              fontWeight: 500,
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem"
            }}>
              <span className="animate-pulse">●</span> Redirecting to support portal in 2 seconds...
            </div>

            <a 
              href="https://support.trackcodex.com"
              style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                color: "white",
                padding: "1rem 2.5rem",
                borderRadius: "14px",
                fontWeight: 600,
                textDecoration: "none",
                fontSize: "1rem",
                transition: "all 0.3s ease",
                boxShadow: "0 10px 15px -3px rgba(37, 99, 235, 0.4)",
                marginTop: "1rem"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 15px 20px -5px rgba(37, 99, 235, 0.5)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(37, 99, 235, 0.4)";
              }}
            >
              Go to Support Now
            </a>

            <Link 
              to="/"
              style={{ 
                color: "#64748b", 
                fontSize: "0.9rem", 
                textDecoration: "none",
                marginTop: "1rem",
                transition: "color 0.2s"
              }}
              onMouseOver={(e) => e.currentTarget.style.color = "#94a3b8"}
              onMouseOut={(e) => e.currentTarget.style.color = "#64748b"}
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default Contact;


