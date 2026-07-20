/**
 * Illustrative, dependency-free map. Swap this out for a real Google Maps /
 * Mapbox embed once you have an API key — the props/layout are designed to
 * drop straight into the same rounded container.
 */
export function StylizedMap() {
  const pins = [
    { x: 210, y: 130 }, { x: 480, y: 90 }, { x: 640, y: 190 }, { x: 260, y: 260 },
    { x: 420, y: 300 }, { x: 340, y: 380 }, { x: 560, y: 420 }, { x: 150, y: 340 },
  ];
  return (
    <svg viewBox="0 0 760 500" className="h-full w-full">
      <rect width="760" height="500" fill="#E8E8EC" />
      <g stroke="#C7C7D1" strokeWidth="3" fill="none">
        <path d="M0 120 Q200 80 380 130 T760 100" />
        <path d="M0 260 Q220 220 380 260 T760 240" />
        <path d="M0 400 Q200 360 380 400 T760 380" />
        <path d="M120 0 Q160 200 140 500" />
        <path d="M380 0 L380 500" />
        <path d="M620 0 Q580 220 640 500" />
      </g>
      <text x="380" y="250" textAnchor="middle" fontSize="26" fontWeight="700" fill="#26262E">
        Bengaluru
      </text>
      <circle cx="380" cy="230" r="60" fill="#A78BFA" opacity="0.18" />
      <circle cx="220" cy="360" r="45" fill="#34D399" opacity="0.18" />
      {pins.map((p, i) => (
        <g key={i} transform={`translate(${p.x}, ${p.y})`}>
          <circle r="9" fill={i % 3 === 0 ? "#7C3AED" : i % 3 === 1 ? "#3B82F6" : "#10B981"} stroke="#fff" strokeWidth="2" />
        </g>
      ))}
    </svg>
  );
}
