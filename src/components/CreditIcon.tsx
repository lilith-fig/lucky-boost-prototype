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
      <img 
        src="/currency-credit.png" 
        alt="Credit" 
        width={size} 
        height={size}
        style={{ width: size, height: size, objectFit: 'contain' }}
      />
    </div>
  );
}
