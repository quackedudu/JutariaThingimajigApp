import React from 'react';

interface BackgroundPatternProps {
  variant?: 'primary' | 'secondary' | 'subtle' | 'gold';
  className?: string;
}

export function BackgroundPattern({ variant = 'primary', className = '' }: BackgroundPatternProps) {
  const patterns = {
    primary: (
      <svg className={`absolute inset-0 w-full h-full ${className}`} style={{ opacity: 0.08 }}>
        <defs>
          <pattern id="primary-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="2" fill="currentColor" />
            <circle cx="50" cy="30" r="2" fill="currentColor" />
            <circle cx="30" cy="50" r="2" fill="currentColor" />
            <circle cx="70" cy="70" r="2" fill="currentColor" />
            <path d="M 0 0 L 20 20" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
            <path d="M 40 20 L 60 40" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#primary-pattern)" />
      </svg>
    ),
    secondary: (
      <svg className={`absolute inset-0 w-full h-full ${className}`} style={{ opacity: 0.06 }}>
        <defs>
          <pattern id="secondary-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <rect x="10" y="10" width="15" height="15" fill="currentColor" opacity="0.4" />
            <rect x="35" y="35" width="15" height="15" fill="currentColor" opacity="0.4" />
            <polygon points="30,5 35,15 25,15" fill="currentColor" opacity="0.3" />
            <polygon points="5,30 15,35 15,25" fill="currentColor" opacity="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#secondary-pattern)" />
      </svg>
    ),
    subtle: (
      <svg className={`absolute inset-0 w-full h-full ${className}`} style={{ opacity: 0.04 }}>
        <defs>
          <pattern id="subtle-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="0.5" />
            <line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#subtle-pattern)" />
      </svg>
    ),
    gold: (
      <svg className={`absolute inset-0 w-full h-full ${className}`} style={{ opacity: 0.1 }}>
        <defs>
          <pattern id="gold-pattern" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
            <circle cx="25" cy="25" r="1.5" fill="currentColor" />
            <path d="M 10 10 L 15 15 M 35 10 L 40 15 M 10 35 L 15 40 M 35 35 L 40 40" 
                  stroke="currentColor" strokeWidth="1" opacity="0.5" />
            <rect x="22" y="22" width="6" height="6" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#gold-pattern)" />
      </svg>
    )
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {patterns[variant]}
    </div>
  );
}
