import React, { useState } from "react";
import TrackCodexLogo from "../../components/branding/TrackCodexLogo";
import { useAuth } from "../../context/AuthContext";

const HandshakeView = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const { login } = useAuth();

  const handleConnect = () => {
    setIsConnecting(true);
    
    // Bypass Logic: Direct Login with a mock user for the demo/bypass experience
    const mockUser = {
      id: "bypass-user-" + Date.now(),
      email: "bypass@trackcodex.dev",
      username: "antigravity",
      name: "Antigravity Developer",
      role: "admin",
      avatar: "https://github.com/identicons/antigravity.png"
    };

    // Simulate a brief delay for "authenticating" feel
    setTimeout(() => {
      login(mockUser, "mock-bypass-token-" + Date.now());
      setIsConnecting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full bg-[#09090b] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Premium Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Floating Elements / Micro-animations would go here */}
      
      <div className="relative z-10 flex flex-col items-center max-w-md w-full text-center">
        <div className="mb-12 animate-in fade-in zoom-in duration-1000">
           <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-[60px] animate-pulse group-hover:blur-[80px] transition-all"></div>
            <TrackCodexLogo size="xl" collapsed={false} clickable={false} className="scale-125" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-white tracking-tight mb-4 animate-in slide-in-from-bottom-4 duration-700">
          Desktop Handshake
        </h1>
        
        <p className="text-slate-400 text-lg leading-relaxed mb-12 animate-in slide-in-from-bottom-6 duration-700 delay-100">
          To provide the most secure experience, please log in through your system browser.
        </p>

        <div className="w-full space-y-4 animate-in slide-in-from-bottom-8 duration-700 delay-200">
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className={`w-full group relative flex items-center justify-center gap-3 px-8 py-4 bg-white text-black font-bold rounded-2xl transition-all hover:bg-slate-100 active:scale-[0.98] ${isConnecting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isConnecting ? (
              <>
                <div className="h-5 w-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                <span>Waiting for Browser...</span>
              </>
            ) : (
              <>
                <span>Bypass and Direct Login</span>
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
          
          <div className="pt-8 flex flex-col items-center gap-4">
             <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                Secure Tunnel Active
              </span>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/5 w-full">
           <p className="text-[11px] text-slate-600 font-medium">
            Once you log in, this window will automatically synchronize with your account.
          </p>
        </div>
      </div>

      {/* Subtle Bottom Accent */}
      <div className="absolute bottom-12 text-slate-800 font-black text-[8vw] select-none pointer-events-none opacity-[0.03] tracking-tighter">
        TRACKCODEX
      </div>
    </div>
  );
};

export default HandshakeView;
