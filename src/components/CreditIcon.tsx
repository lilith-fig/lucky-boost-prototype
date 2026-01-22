import './CreditIcon.css';

interface CreditIconProps {
  size?: number;
  className?: string;
}

export function CreditIcon({ size = 14, className = '' }: CreditIconProps) {
  return (
    <div 
      className={`credit-icon ${className}`}
      style={{ width: size, height: size }}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none"
      >
        {/* Outer glow ring */}
        <circle
          cx="12"
          cy="12"
          r="11"
          fill="url(#creditGlow)"
          opacity="0.8"
        />
        {/* Main circle background */}
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="url(#creditGradient)"
        />
        {/* Inner pattern/rings */}
        <circle
          cx="12"
          cy="12"
          r="8.5"
          fill="none"
          stroke="rgba(211, 255, 15, 0.3)"
          strokeWidth="0.5"
        />
        {/* Credit symbol - stylized C with horizontal line */}
        <path
          d="M12 7C9.5 7 7.5 8.5 7.5 10.5C7.5 12.5 9.5 14 12 14C13.2 14 14.2 13.6 14.8 13L15.5 13.7C14.7 14.6 13.4 15.2 12 15.2C8.8 15.2 6.2 13.1 6.2 10.5C6.2 7.9 8.8 5.8 12 5.8C13.4 5.8 14.7 6.4 15.5 7.3L14.8 8C14.2 7.4 13.2 7 12 7Z"
          fill="url(#creditSymbolGradient)"
        />
        <line
          x1="8"
          y1="10.5"
          x2="16"
          y2="10.5"
          stroke="url(#creditSymbolGradient)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <defs>
          {/* Glow gradient */}
          <radialGradient id="creditGlow" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#D3FF0F" stopOpacity="1" />
            <stop offset="50%" stopColor="#ECFF6F" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FEC22B" stopOpacity="0.4" />
          </radialGradient>
          {/* Background gradient */}
          <radialGradient id="creditGradient" cx="50%" cy="100%">
            <stop offset="0%" stopColor="#D3FF0F" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#ECFF6F" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#FEC22B" stopOpacity="0.5" />
          </radialGradient>
          {/* Symbol gradient - metallic silver with green highlights */}
          <linearGradient id="creditSymbolGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E8E8E8" />
            <stop offset="30%" stopColor="#D3FF0F" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="70%" stopColor="#C0C0C0" />
            <stop offset="100%" stopColor="#A0A0A0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
