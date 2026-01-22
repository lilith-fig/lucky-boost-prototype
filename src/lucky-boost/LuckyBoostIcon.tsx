import React, { useId, useRef, useEffect, useState } from 'react';
import './LuckyBoostIcon.css';

interface LuckyBoostIconProps {
  percentage: number; // 0-100
  size?: number; // Icon size in pixels
  className?: string;
}

export const LuckyBoostIcon: React.FC<LuckyBoostIconProps> = ({ 
  percentage, 
  size = 40,
  className = '' 
}) => {
  const roundedPercentage = Math.round(percentage);
  const gradientId0 = useId();
  const gradientId1 = useId();
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(294.25); // Default fallback value

  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      setPathLength(length);
    }
  }, []);

  return (
    <div 
      className={`lucky-boost-icon ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Outer neon green border with glow */}
      <div className="icon-border">
        {/* Inner black background */}
        <div className="icon-background">
          {/* Inside shape */}
          <div className="icon-inside-shape"></div>
          {/* Progress bar - squares with gradient borders */}
          <svg 
            className="icon-progress-bar"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid meet"
            style={{ 
              position: 'absolute', 
              left: '20px',
              top: '25px',
              transform: 'translate(-50%, -50%)', 
              zIndex: 1, 
              width: '100%', 
              height: '100%',
              overflow: 'visible',
              margin: '-5px 0',
              boxSizing: 'content-box',
              verticalAlign: 'middle',
              textAlign: 'center',
              letterSpacing: '9.4px'
            }}
          >
            <defs>
              <linearGradient id={`progressGradient-${gradientId0}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F27D05" />
                <stop offset="33.33%" stopColor="#FFCF77" />
                <stop offset="66.66%" stopColor="#FEC22B" />
                <stop offset="100%" stopColor="#D3FF0F" />
              </linearGradient>
            </defs>
            {/* Placeholder progress line - full square, opacity 0.1 */}
            <path
              d="M 50 10 L 75 10 A 15 15 0 0 1 90 25 L 90 75 A 15 15 0 0 1 75 90 L 25 90 A 15 15 0 0 1 10 75 L 10 25 A 15 15 0 0 1 25 10 L 50 10"
              fill="none"
              stroke={`url(#progressGradient-${gradientId0})`}
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.1"
            />
            {/* Current progress line - animated with stroke-dasharray */}
            <path
              ref={pathRef}
              d="M 50 10 L 75 10 A 15 15 0 0 1 90 25 L 90 75 A 15 15 0 0 1 75 90 L 25 90 A 15 15 0 0 1 10 75 L 10 25 A 15 15 0 0 1 25 10 L 50 10"
              fill="none"
              stroke={`url(#progressGradient-${gradientId0})`}
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="1"
              strokeDasharray={pathLength}
              strokeDashoffset={pathLength * (1 - roundedPercentage / 100)}
            />
          </svg>
          {/* Icon vector */}
          <svg 
            className="icon-vector"
            xmlns="http://www.w3.org/2000/svg" 
            width="12" 
            height="12" 
            viewBox="0 0 12 12" 
            fill="none"
            style={{
              position: 'absolute',
              overflow: 'visible',
              display: 'flex',
              flexWrap: 'wrap',
              transform: 'translate(-50%, -50%)',
              width: '14px',
              height: '13px',
              flexDirection: 'row',
              top: '14px',
              left: '20px',
              marginLeft: 0,
              marginRight: 0,
              boxSizing: 'content-box',
              color: 'rgba(255, 255, 255, 1)',
              verticalAlign: 'bottom'
            }}
          >
            <path d="M4.69213 11.5494C4.88597 10.8365 4.98558 10.0884 4.85727 9.35476C4.84621 9.29149 4.80465 9.25259 4.74149 9.26427C4.61574 9.28752 4.40923 9.33694 4.35754 9.28285L2.78309 7.69734C2.71377 7.62753 2.67916 7.53046 2.6887 7.43253C2.7051 7.26412 2.59167 7.10901 2.42367 7.08875C2.1375 7.05423 1.8494 7.05243 1.56258 7.07547C1.02031 7.11903 0.529333 6.67338 0.728557 6.16714C0.898097 5.73634 1.12395 5.32726 1.40017 4.96754C2.13054 4.01679 3.23208 3.43573 4.3862 3.15737C4.54966 3.11794 4.69801 3.03085 4.81068 2.90602C6.54229 0.987494 9.11581 -0.181583 11.7273 0.0231474C11.8542 0.0331001 11.9388 0.105022 11.9528 0.231587C11.9614 0.30862 11.9682 0.3853 11.9697 0.410713C12.1004 2.97438 10.9444 5.47007 9.06602 7.16376C8.943 7.27469 8.85639 7.42027 8.81684 7.58113C8.62339 8.36801 8.30647 9.12756 7.80979 9.77096C7.05655 10.7438 5.90306 11.3602 4.69213 11.5494ZM9.57982 3.765C9.57982 3.00834 8.96673 2.39525 8.21007 2.39525C7.45342 2.39525 6.84032 3.00834 6.84032 3.765C6.84032 4.52166 7.45342 5.13475 8.21007 5.13475C8.96673 5.13475 9.57982 4.52166 9.57982 3.765Z" fill={`url(#${gradientId0})`}/>
            <path d="M1.43017 9.85873C1.36627 10.2608 1.71425 10.6073 2.11637 10.544C2.35346 10.5066 2.5843 10.4408 2.79363 10.3288C2.93594 10.2527 3.05302 10.2688 3.04015 10.4297C3.02326 10.7269 2.83916 11.0512 2.64493 11.2674C2.20116 11.7642 1.43978 11.9236 0.729195 11.9734C0.315998 12.0024 -0.0273131 11.6591 0.00171574 11.2459C0.0516509 10.5351 0.211118 9.77126 0.70769 9.33014C0.923877 9.1376 1.25323 8.9535 1.54542 8.93492C1.70629 8.92205 1.72231 9.03909 1.64612 9.18135C1.53435 9.39004 1.46791 9.62129 1.43017 9.85873Z" fill={`url(#${gradientId1})`}/>
            <defs>
              <linearGradient id={gradientId0} x1="4.87032" y1="-2.49896" x2="4.87032" y2="13.001" gradientUnits="userSpaceOnUse">
                <stop offset="0.0332387" stopColor="#F27D05"/>
                <stop offset="0.488365" stopColor="#FFCF77"/>
                <stop offset="0.647844" stopColor="#FEC22B"/>
                <stop offset="0.907525" stopColor="#D3FF0F"/>
              </linearGradient>
              <linearGradient id={gradientId1} x1="4.87032" y1="-2.49896" x2="4.87032" y2="13.001" gradientUnits="userSpaceOnUse">
                <stop offset="0.0332387" stopColor="#F27D05"/>
                <stop offset="0.488365" stopColor="#FFCF77"/>
                <stop offset="0.647844" stopColor="#FEC22B"/>
                <stop offset="0.907525" stopColor="#D3FF0F"/>
              </linearGradient>
            </defs>
          </svg>
          {/* Percentage text */}
          <span 
            className="icon-percentage"
            style={{
              position: 'absolute',
              top: '27px',
              left: '20px',
              transform: 'translate(-50%, -50%)'
            }}
          >
            {roundedPercentage}%
          </span>
        </div>
      </div>
    </div>
  );
};
