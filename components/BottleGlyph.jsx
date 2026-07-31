export default function BottleGlyph({ className = "" }) {
  return (
    <svg viewBox="0 0 200 320" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bottleGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a97c2f" />
          <stop offset="45%" stopColor="#f1d989" />
          <stop offset="100%" stopColor="#caa14b" />
        </linearGradient>
      </defs>
      <rect x="80" y="18" width="40" height="34" rx="6" stroke="url(#bottleGold)" strokeWidth="3" />
      <path d="M92 52 L92 78 Q60 100 60 150 L60 275 Q60 300 85 300 L115 300 Q140 300 140 275 L140 150 Q140 100 108 78 L108 52 Z"
        stroke="url(#bottleGold)" strokeWidth="3" strokeLinejoin="round" />
      <line x1="60" y1="150" x2="140" y2="150" stroke="url(#bottleGold)" strokeWidth="2" opacity="0.5" />
      <rect x="72" y="190" width="56" height="46" rx="3" stroke="url(#bottleGold)" strokeWidth="2" opacity="0.7" />
      <line x1="82" y1="205" x2="118" y2="205" stroke="url(#bottleGold)" strokeWidth="1.5" opacity="0.6" />
      <line x1="82" y1="215" x2="110" y2="215" stroke="url(#bottleGold)" strokeWidth="1.5" opacity="0.6" />
    </svg>
  );
}
