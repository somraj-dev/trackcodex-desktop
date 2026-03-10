import React from "react";

/**
 * Inline SVG "inbox zero" illustration — ninja octocat with broom in a dark forest.
 * Background is transparent so it blends seamlessly with the page.
 */
const InboxZeroIllustration: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      viewBox="0 0 500 280"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="All caught up illustration"
      style={{ background: "transparent" }}
    >
      <defs>
        {/* Blue glow for the character */}
        <filter id="neon" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Fade-out edges so scene blends with page */}
        <radialGradient id="fadeEdge" cx="50%" cy="50%" r="50%">
          <stop offset="60%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id="fadeMask">
          <rect width="500" height="280" fill="url(#fadeEdge)" />
        </mask>
      </defs>

      {/* All scene content masked so edges fade to transparent */}
      <g mask="url(#fadeMask)">

        {/* Far background trees — very subtle, dark */}
        <g fill="#1a2030" opacity="0.6">
          <polygon points="20,200 35,100 50,200" />
          <polygon points="45,200 65,80 85,200" />
          <polygon points="80,200 95,110 110,200" />
          <polygon points="105,200 125,70 145,200" />
          <polygon points="350,200 370,85 390,200" />
          <polygon points="385,200 400,100 415,200" />
          <polygon points="410,200 430,75 450,200" />
          <polygon points="445,200 460,95 475,200" />
        </g>

        {/* Mid trees — slightly brighter */}
        <g fill="#222d3d" opacity="0.8">
          <polygon points="0,210 25,120 50,210" />
          <polygon points="55,210 80,90 105,210" />
          <polygon points="120,210 145,105 170,210" />
          <polygon points="155,210 175,130 195,210" />
          <polygon points="305,210 330,100 355,210" />
          <polygon points="350,210 380,90 410,210" />
          <polygon points="420,210 445,110 470,210" />
          <polygon points="460,210 480,125 500,210" />
        </g>

        {/* Foreground trees — most visible */}
        <g fill="#2a3545">
          <polygon points="-10,220 15,140 40,220" />
          <polygon points="140,220 165,145 190,220" />
          <polygon points="310,220 340,135 370,220" />
          <polygon points="455,220 478,150 500,220" />
        </g>

        {/* Ground plane */}
        <ellipse cx="250" cy="225" rx="220" ry="18" fill="#2a3545" opacity="0.5" />
        <rect x="30" y="220" width="440" height="60" fill="#1e2a38" opacity="0.4" rx="4" />

        {/* Moon */}
        <circle cx="380" cy="55" r="12" fill="#2a3545" />
        <circle cx="382" cy="53" r="10" fill="#3d4f63" opacity="0.7" />

        {/* Stars */}
        <circle cx="70" cy="40" r="1" fill="#6e7681" opacity="0.6" />
        <circle cx="130" cy="25" r="0.8" fill="#6e7681" opacity="0.4" />
        <circle cx="220" cy="35" r="1.2" fill="#6e7681" opacity="0.5" />
        <circle cx="310" cy="20" r="0.7" fill="#6e7681" opacity="0.3" />
        <circle cx="420" cy="30" r="1" fill="#6e7681" opacity="0.5" />
        <circle cx="460" cy="65" r="0.6" fill="#6e7681" opacity="0.3" />

        {/* Rocks */}
        <g>
          <ellipse cx="345" cy="222" rx="18" ry="9" fill="#3d4f63" />
          <ellipse cx="345" cy="219" rx="15" ry="8" fill="#4a5d72" />
          <ellipse cx="345" cy="217" rx="12" ry="6" fill="#566a80" />
        </g>
        <g>
          <ellipse cx="150" cy="224" rx="10" ry="5" fill="#3d4f63" />
          <ellipse cx="150" cy="222" rx="8" ry="4" fill="#4a5d72" />
        </g>

        {/* === NINJA OCTOCAT CHARACTER === */}
        <g filter="url(#neon)" transform="translate(250, 170)">
          {/* Staff / Broom — long diagonal line */}
          <line x1="-55" y1="-70" x2="55" y2="40" stroke="#58a6ff" strokeWidth="2.5" strokeLinecap="round" />
          {/* Broom bristles at bottom */}
          <g transform="translate(48, 34)">
            <line x1="0" y1="0" x2="8" y2="10" stroke="#58a6ff" strokeWidth="1.5" />
            <line x1="0" y1="0" x2="12" y2="6" stroke="#58a6ff" strokeWidth="1.5" />
            <line x1="0" y1="0" x2="14" y2="2" stroke="#58a6ff" strokeWidth="1.5" />
            <line x1="0" y1="0" x2="10" y2="-3" stroke="#58a6ff" strokeWidth="1.2" />
          </g>

          {/* Body — round torso */}
          <ellipse cx="0" cy="15" rx="25" ry="28" fill="none" stroke="#58a6ff" strokeWidth="2" />

          {/* Head — round */}
          <circle cx="0" cy="-25" r="20" fill="none" stroke="#58a6ff" strokeWidth="2" />

          {/* Ears — pointed cat ears */}
          <path d="M -15,-42 L -10,-58 L -3,-42" fill="none" stroke="#58a6ff" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 15,-42 L 10,-58 L 3,-42" fill="none" stroke="#58a6ff" strokeWidth="2" strokeLinejoin="round" />

          {/* Headband / ninja mask */}
          <path d="M -22,-30 L 22,-30" stroke="#58a6ff" strokeWidth="3" strokeLinecap="round" />
          {/* Headband tails flowing right */}
          <path d="M 20,-30 Q 30,-28 38,-35" fill="none" stroke="#58a6ff" strokeWidth="2" strokeLinecap="round" />
          <path d="M 20,-30 Q 32,-25 36,-27" fill="none" stroke="#58a6ff" strokeWidth="1.5" strokeLinecap="round" />

          {/* Eyes — round with pupils */}
          <circle cx="-8" cy="-25" r="4.5" fill="none" stroke="#58a6ff" strokeWidth="1.5" />
          <circle cx="8" cy="-25" r="4.5" fill="none" stroke="#58a6ff" strokeWidth="1.5" />
          <circle cx="-8" cy="-25" r="2" fill="#58a6ff" />
          <circle cx="8" cy="-25" r="2" fill="#58a6ff" />
          {/* Eye glints */}
          <circle cx="-6" cy="-27" r="1" fill="#c9d1d9" />
          <circle cx="10" cy="-27" r="1" fill="#c9d1d9" />

          {/* Nose — small triangle */}
          <path d="M -1.5,-17 L 0,-15 L 1.5,-17 Z" fill="#58a6ff" opacity="0.8" />

          {/* Mouth — small smile */}
          <path d="M -3,-13 Q 0,-10 3,-13" fill="none" stroke="#58a6ff" strokeWidth="1.2" />

          {/* Whiskers */}
          <line x1="-22" y1="-18" x2="-10" y2="-17" stroke="#58a6ff" strokeWidth="0.8" opacity="0.5" />
          <line x1="-20" y1="-14" x2="-9" y2="-15" stroke="#58a6ff" strokeWidth="0.8" opacity="0.5" />
          <line x1="22" y1="-18" x2="10" y2="-17" stroke="#58a6ff" strokeWidth="0.8" opacity="0.5" />
          <line x1="20" y1="-14" x2="9" y2="-15" stroke="#58a6ff" strokeWidth="0.8" opacity="0.5" />

          {/* Belt / sash */}
          <line x1="-25" y1="6" x2="25" y2="6" stroke="#58a6ff" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="-4" y="2" width="8" height="8" rx="1.5" fill="none" stroke="#58a6ff" strokeWidth="1.5" />

          {/* Left arm — reaching up to grip staff */}
          <path d="M -23,0 Q -35,-15 -30,-30" fill="none" stroke="#58a6ff" strokeWidth="2" strokeLinecap="round" />
          <circle cx="-30" cy="-30" r="4" fill="none" stroke="#58a6ff" strokeWidth="1.5" />

          {/* Right arm — reaching forward to staff */}
          <path d="M 23,2 Q 32,-5 30,-18" fill="none" stroke="#58a6ff" strokeWidth="2" strokeLinecap="round" />
          <circle cx="30" cy="-18" r="4" fill="none" stroke="#58a6ff" strokeWidth="1.5" />

          {/* Legs */}
          <path d="M -10,40 Q -14,50 -18,52" fill="none" stroke="#58a6ff" strokeWidth="2" strokeLinecap="round" />
          <path d="M 10,40 Q 14,50 18,52" fill="none" stroke="#58a6ff" strokeWidth="2" strokeLinecap="round" />
          {/* Feet */}
          <ellipse cx="-20" cy="53" rx="6" ry="3" fill="none" stroke="#58a6ff" strokeWidth="1.5" />
          <ellipse cx="20" cy="53" rx="6" ry="3" fill="none" stroke="#58a6ff" strokeWidth="1.5" />

          {/* Tail — curving up and right */}
          <path d="M 14,35 Q 42,25 45,8 Q 47,0 42,-3" fill="none" stroke="#58a6ff" strokeWidth="1.8" strokeLinecap="round" />
        </g>

        {/* Small critter left — little armadillo/mouse */}
        <g transform="translate(135, 218)">
          <ellipse cx="0" cy="0" rx="10" ry="6" fill="none" stroke="#8b949e" strokeWidth="1.2" />
          <circle cx="-8" cy="-3" r="4" fill="none" stroke="#8b949e" strokeWidth="1.2" />
          <circle cx="-10" cy="-4" r="1.2" fill="#8b949e" />
          {/* Ears */}
          <ellipse cx="-6" cy="-7" rx="2" ry="3" fill="none" stroke="#8b949e" strokeWidth="0.8" />
          <ellipse cx="-4" cy="-7" rx="2" ry="3" fill="none" stroke="#8b949e" strokeWidth="0.8" />
          {/* Tail */}
          <path d="M 10,0 Q 16,-6 20,-8" fill="none" stroke="#8b949e" strokeWidth="1" />
          {/* Legs */}
          <line x1="-4" y1="5" x2="-6" y2="8" stroke="#8b949e" strokeWidth="0.8" />
          <line x1="4" y1="5" x2="6" y2="8" stroke="#8b949e" strokeWidth="0.8" />
        </g>

        {/* Small critter right — tiny bug */}
        <g transform="translate(370, 220)">
          <ellipse cx="0" cy="0" rx="6" ry="4" fill="none" stroke="#8b949e" strokeWidth="1" />
          <circle cx="6" cy="-2" r="3" fill="none" stroke="#8b949e" strokeWidth="1" />
          <circle cx="7" cy="-3" r="1" fill="#8b949e" />
          {/* Antennae */}
          <path d="M 8,-5 Q 10,-10 12,-11" fill="none" stroke="#8b949e" strokeWidth="0.8" />
          <path d="M 6,-5 Q 5,-9 3,-10" fill="none" stroke="#8b949e" strokeWidth="0.8" />
          {/* Legs */}
          <line x1="-3" y1="3" x2="-5" y2="6" stroke="#8b949e" strokeWidth="0.7" />
          <line x1="3" y1="3" x2="5" y2="6" stroke="#8b949e" strokeWidth="0.7" />
        </g>
      </g>
    </svg>
  );
};

export default InboxZeroIllustration;
