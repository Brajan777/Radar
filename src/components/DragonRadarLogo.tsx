import React from 'react';

interface DragonRadarLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
}

export const DragonRadarLogo: React.FC<DragonRadarLogoProps> = ({
  size = 'md',
  animated = true,
  className = '',
}) => {
  const sizeMap = {
    sm: { container: 'w-8 h-8', px: 32 },
    md: { container: 'w-10 h-10', px: 40 },
    lg: { container: 'w-14 h-14', px: 56 },
    xl: { container: 'w-20 h-20', px: 80 },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${currentSize.container} ${className}`}>
      {/* 90s Retro Pop Radar Icon with Flashy Neon Colors & Hard Black Outlines */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full select-none filter drop-shadow-[2px_2px_0px_#000]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Top Antenna / Clicker Button in Hot Pink */}
        <rect
          x="42"
          y="4"
          width="16"
          height="12"
          rx="3"
          fill="#FF007F"
          stroke="#000000"
          strokeWidth="3.5"
        />
        <circle cx="50" cy="8" r="3" fill="#FFE600" />

        {/* Outer Bezel in Electric Yellow with thick black 90s outline */}
        <circle
          cx="50"
          cy="55"
          r="41"
          fill="#FFE600"
          stroke="#000000"
          strokeWidth="4"
        />

        {/* Inner Ring in Electric Cyan */}
        <circle
          cx="50"
          cy="55"
          r="34"
          fill="#00F0FF"
          stroke="#000000"
          strokeWidth="3"
        />

        {/* Concentric 90s Target Rings */}
        <circle cx="50" cy="55" r="26" stroke="#000000" strokeWidth="1.5" strokeDasharray="3 3" />
        <circle cx="50" cy="55" r="18" stroke="#000000" strokeWidth="2" />
        <circle cx="50" cy="55" r="9" stroke="#FF007F" strokeWidth="2" strokeDasharray="2 2" />

        {/* 90s Crosshairs */}
        <line x1="16" y1="55" x2="84" y2="55" stroke="#000000" strokeWidth="2" />
        <line x1="50" y1="21" x2="50" y2="89" stroke="#000000" strokeWidth="2" />

        {/* 90s Retro Radar Sweep Spinner */}
        {animated && (
          <g className="origin-[50px_55px] animate-spin" style={{ animationDuration: '3s' }}>
            <line x1="50" y1="55" x2="78" y2="33" stroke="#FF007F" strokeWidth="2.5" />
            <polygon points="50,55 78,33 72,24" fill="#FF007F" opacity="0.35" />
          </g>
        )}

        {/* 90s Star / Blip 1: Hot Magenta Starburst */}
        <polygon
          points="64,42 67,48 73,49 68,53 70,59 64,56 59,59 61,53 56,49 62,48"
          fill="#FF007F"
          stroke="#000000"
          strokeWidth="1.5"
          className={animated ? 'animate-pulse' : ''}
        />

        {/* 90s Diamond Blip 2: Neon Lime */}
        <polygon
          points="35,68 40,73 35,78 30,73"
          fill="#CCFF00"
          stroke="#000000"
          strokeWidth="1.5"
        />

        {/* Center Target Dot */}
        <circle cx="50" cy="55" r="4" fill="#FF007F" stroke="#000000" strokeWidth="1.5" />
      </svg>
    </div>
  );
};
