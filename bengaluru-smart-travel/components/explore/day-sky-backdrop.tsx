export function DaySkyBackdrop() {
  return (
    <svg viewBox="0 0 1400 700" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 -z-10 h-full w-full">
      <defs>
        <linearGradient id="daySky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6EC0F0" />
          <stop offset="55%" stopColor="#BEE3F8" />
          <stop offset="100%" stopColor="#F3F8FC" />
        </linearGradient>
        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFE08A" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FFE08A" stopOpacity="0" />
        </radialGradient>
      </defs>

      <style>{`
        @keyframes bird-fly {
          0% { transform: translateX(-8%); }
          100% { transform: translateX(115%); }
        }
        @keyframes cloud-drift {
          0% { transform: translateX(0); }
          100% { transform: translateX(50px); }
        }
      `}</style>

      <rect width="1400" height="700" fill="url(#daySky)" />

      <ellipse
        cx="1060"
        cy="140"
        rx="220"
        ry="220"
        fill="url(#sunGlow)"
        className="origin-center animate-pulse"
        style={{ animationDuration: "6s" }}
      />
      <circle cx="1060" cy="140" r="68" fill="#FFD877" />

      <g fill="#FFFFFF" opacity="0.85">
        <ellipse cx="260" cy="120" rx="70" ry="24" style={{ animation: "cloud-drift 26s ease-in-out infinite alternate" }} />
        <ellipse cx="315" cy="105" rx="48" ry="20" style={{ animation: "cloud-drift 26s ease-in-out infinite alternate" }} />
        <ellipse cx="640" cy="95" rx="60" ry="20" style={{ animation: "cloud-drift 32s ease-in-out infinite alternate" }} />
        <ellipse cx="690" cy="82" rx="40" ry="16" style={{ animation: "cloud-drift 32s ease-in-out infinite alternate" }} />
        <ellipse cx="900" cy="235" rx="55" ry="18" opacity="0.7" style={{ animation: "cloud-drift 22s ease-in-out infinite alternate" }} />
      </g>

      {[0, 1, 2, 3].map((i) => (
        <g
          key={i}
          style={{
            animation: `bird-fly ${16 + i * 4}s linear infinite`,
            animationDelay: `${i * 3.2}s`,
          }}
        >
          <path
            d={`M0,${170 + i * 55} q7,-11 14,0 q7,-11 14,0`}
            stroke="#334155"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            opacity="0.75"
          />
        </g>
      ))}

      <g fill="#A9BBCC" opacity="0.75">
        <rect x="40" y="420" width="70" height="220" />
        <rect x="120" y="360" width="60" height="280" />
        <rect x="190" y="440" width="50" height="200" />
        <rect x="250" y="300" width="80" height="340" />
        <rect x="340" y="400" width="60" height="240" />
        <rect x="410" y="250" width="70" height="390" />
        <rect x="490" y="370" width="60" height="270" />
        <rect x="560" y="320" width="70" height="320" />
        <rect x="640" y="410" width="55" height="230" />
        <rect x="710" y="270" width="75" height="370" />
        <rect x="800" y="380" width="60" height="260" />
        <rect x="870" y="330" width="70" height="310" />
        <rect x="950" y="420" width="55" height="220" />
        <rect x="1020" y="360" width="65" height="280" />
        <rect x="1100" y="290" width="75" height="350" />
        <rect x="1190" y="400" width="60" height="240" />
        <rect x="1260" y="350" width="70" height="290" />
      </g>

      <rect x="0" y="630" width="1400" height="70" fill="#DCE7F0" />
    </svg>
  );
}
