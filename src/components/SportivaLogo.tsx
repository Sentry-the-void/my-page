import React from 'react';

interface SportivaLogoProps {
  className?: string;
  variant?: 'color' | 'light' | 'dark';
  height?: number | string;
  showTagline?: boolean;
}

export const SportivaLogo: React.FC<SportivaLogoProps> = ({
  className = 'h-8 w-auto',
  variant = 'color',
  showTagline = false,
}) => {
  // Color palette matching the user's uploaded logo exactly:
  // Primary Navy: #072348 or #0B2545
  // Racing Red: #E31B23
  const isLight = variant === 'light';
  const navyColor = isLight ? '#FFFFFF' : '#0B2545';
  const redColor = '#E31B23';

  return (
    <div className={`inline-flex flex-col items-start select-none ${className}`}>
      <svg
        viewBox="0 0 520 115"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
        aria-label="SPORTIVA Sports Apparel"
      >
        <defs>
          <linearGradient id="speedGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E31B23" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#E31B23" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Top Aerodynamic Curved Red Arc */}
        <path
          d="M 145 36 C 220 18, 335 12, 435 14 C 375 18, 255 24, 160 40 Z"
          fill={redColor}
        />

        {/* Speed Streaks on Left side of "S" */}
        {/* Top streak (Red) */}
        <polygon
          points="46,47 98,47 91,55 39,55"
          fill={redColor}
        />
        {/* Middle streak (Red) */}
        <polygon
          points="25,66 84,66 77,74 18,74"
          fill={redColor}
        />
        {/* Bottom streak (Navy or White in light mode) */}
        <polygon
          points="32,85 82,85 75,93 25,93"
          fill={navyColor}
        />

        {/* Wordmark: "SPORTIVA" rendered in forward athletic oblique */}
        <g transform="skewX(-16)">
          {/* Main "SPORT" in Deep Navy */}
          <text
            x="115"
            y="94"
            fill={navyColor}
            style={{
              fontFamily: "'Plus Jakarta Sans', 'Arial Black', sans-serif",
              fontWeight: 900,
              fontSize: '68px',
              letterSpacing: '-0.035em',
            }}
          >
            SPORT
          </text>

          {/* "IVA" in Racing Red */}
          <text
            x="368"
            y="94"
            fill={redColor}
            style={{
              fontFamily: "'Plus Jakarta Sans', 'Arial Black', sans-serif",
              fontWeight: 900,
              fontSize: '68px',
              letterSpacing: '-0.035em',
            }}
          >
            IVA
          </text>
        </g>
      </svg>

      {showTagline && (
        <span
          className={`text-[9px] font-mono uppercase tracking-[0.25em] font-bold mt-0.5 ${
            isLight ? 'text-slate-300' : 'text-slate-500'
          }`}
        >
          Engineered Activewear · Performance Lab
        </span>
      )}
    </div>
  );
};
