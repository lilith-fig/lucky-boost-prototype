import React, { useEffect, useState } from 'react';
import './ProgressAnimation.css';

interface ProgressAnimationProps {
  progressAdded: number;
  onComplete: () => void;
}

export const ProgressAnimation: React.FC<ProgressAnimationProps> = ({
  progressAdded,
  onComplete,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300); // Wait for fade out animation
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className={`progress-animation ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="animation-content">
        <div className="animation-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
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
        <div className="animation-text">
          <span className="animation-label">+{progressAdded}</span>
          <span className="animation-sublabel">Lucky Boost</span>
        </div>
      </div>
    </div>
  );
};
