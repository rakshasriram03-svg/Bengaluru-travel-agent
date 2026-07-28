export function CitySkylineBackdrop() {
  return (
    <svg viewBox="0 0 1400 700" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 -z-10 h-full w-full">
      <defs>
        <linearGradient id="heroSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0B1B32" />
          <stop offset="55%" stopColor="#081221" />
          <stop offset="100%" stopColor="#030509" />
        </linearGradient>
        <linearGradient id="heroGlow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="1400" height="700" fill="url(#heroSky)" />
      <ellipse
        cx="700"
        cy="120"
        rx="500"
        ry="200"
        fill="url(#heroGlow)"
        className="origin-center animate-pulse"
        style={{ animationDuration: "6s" }}
      />
      <ellipse cx="700" cy="120" rx="320" ry="130" fill="hsl(var(--accent-glow) / 0.12)" className="animate-pulse" style={{ animationDuration: "8s", animationDelay: "1s" }} />
      {[...Array(60)].map((_, i) => (
        <circle
          key={i}
          cx={((i * 61 + 20) % 1380) + 10}
          cy={((i * 97) % 260) + 20}
          r={i % 5 === 0 ? 1.8 : 1}
          fill="#A5F3FC"
          opacity={0.4 + (i % 4) * 0.15}
          className="animate-pulse"
          style={{ animationDuration: `${3 + (i % 5)}s`, animationDelay: `${(i % 7) * 0.3}s` }}
        />
      ))}
      <g fill="#081020" opacity="0.9">
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
      <g fill="#F4E68A" opacity="0.5">
        {[...Array(120)].map((_, i) => (
          <rect key={i} x={50 + ((i * 37) % 1300)} y={330 + ((i * 53) % 280)} width="4" height="7" />
        ))}
      </g>
      <rect x="0" y="630" width="1400" height="70" fill="#030509" />
    </svg>
  );
}
