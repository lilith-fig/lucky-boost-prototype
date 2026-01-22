import './LuckyBoostLogo.css';

interface LuckyBoostLogoProps {
  size?: number;
  className?: string;
}

export function LuckyBoostLogo({ size = 24, className = '' }: LuckyBoostLogoProps) {
  return (
    <div 
      className={`lucky-boost-logo ${className}`}
      style={{ height: size, width: 'auto' }}
    >
      <img 
        src="/lucky-boost-logo.png" 
        alt="Lucky Boost" 
        style={{ height: size, width: 'auto' }}
      />
    </div>
  );
}
