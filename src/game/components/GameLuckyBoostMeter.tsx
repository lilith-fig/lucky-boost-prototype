import './GameLuckyBoostMeter.css';

interface GameLuckyBoostMeterProps {
  progress: number; // 0-100
  onClick?: () => void;
}

export function GameLuckyBoostMeter({ progress, onClick }: GameLuckyBoostMeterProps) {
  const percentage = Math.min(100, Math.max(0, progress));

  return (
    <button
      className="game-lucky-boost-meter"
      onClick={onClick}
      aria-label="Lucky Boost"
    >
      <div className="meter-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2L2 7L12 12L22 7L12 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 17L12 22L22 17"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 12L12 17L22 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="meter-percentage">{Math.round(percentage)}%</div>
      <div className="meter-progress-ring" style={{ '--progress': `${percentage}%` } as React.CSSProperties}>
        <svg width="40" height="40" viewBox="0 0 40 40">
          <defs>
            <linearGradient id="gameProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d3f015" />
              <stop offset="100%" stopColor="#ff6b00" />
            </linearGradient>
          </defs>
          <rect
            x="2"
            y="2"
            width="36"
            height="36"
            rx="8"
            fill="none"
            stroke="var(--global-neutral-grey-80)"
            strokeWidth="4"
          />
          <rect
            x="2"
            y="2"
            width="36"
            height="36"
            rx="8"
            fill="none"
            stroke="url(#gameProgressGradient)"
            strokeWidth="4"
            strokeDasharray={`${(percentage / 100) * 144} 144`}
            strokeDashoffset="0"
            transform="rotate(-90 20 20)"
            style={{
              transition: 'stroke-dasharray 0.5s ease',
            }}
          />
        </svg>
      </div>
    </button>
  );
}
