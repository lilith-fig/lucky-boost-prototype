import { useId } from 'react';
import './PokeballIcon.css';

interface PokeballIconProps {
  size?: number;
  className?: string;
}

export function PokeballIcon({ size = 16, className = '' }: PokeballIconProps) {
  const gradientId = useId();
  
  // Calculate gradient coordinates for 117deg angle
  // 117deg in CSS is measured clockwise from top (0deg = top)
  // Convert to SVG coordinates: start from center, extend in 117deg direction
  const angle = 117;
  const centerX = 8;
  const centerY = 8;
  const length = 12; // Distance from center to edge
  
  // Convert angle to radians (CSS uses degrees, SVG uses radians for calculations)
  const angleRad = (angle - 90) * (Math.PI / 180); // Adjust for CSS vs SVG angle convention
  
  const x1 = centerX - length * Math.cos(angleRad);
  const y1 = centerY - length * Math.sin(angleRad);
  const x2 = centerX + length * Math.cos(angleRad);
  const y2 = centerY + length * Math.sin(angleRad);
  
  return (
    <div 
      className={`pokeball-icon ${className}`}
      style={{ width: size, height: size }}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 16 16" 
        fill="none"
      >
        <defs>
          <linearGradient id={gradientId} x1={x1} y1={y1} x2={x2} y2={y2} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#DEDEDE" />
            <stop offset="24.07%" stopColor="#868686" />
            <stop offset="55.41%" stopColor="#EAEAEA" />
            <stop offset="75.91%" stopColor="#868686" />
            <stop offset="100%" stopColor="#DEDEDE" />
          </linearGradient>
        </defs>
        <circle cx="8" cy="8" r="7.5" fill="none" stroke={`url(#${gradientId})`} strokeWidth="0.5"/>
        <line x1="0" y1="8" x2="16" y2="8" stroke="rgba(0, 0, 0, 0.2)" strokeWidth="1"/>
        <circle cx="8" cy="8" r="2.5" fill={`url(#${gradientId})`} stroke="rgba(0, 0, 0, 0.15)" strokeWidth="0.5"/>
      </svg>
    </div>
  );
}
