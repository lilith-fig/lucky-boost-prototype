import React from 'react';
import './Progress.css';

export interface ProgressProps {
  value: number; // 0-100
  max?: number;
  className?: string;
  showLabel?: boolean;
  label?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  className = '',
  showLabel = false,
  label,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={`progress-container ${className}`}>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="progress-label">
          {label || `${Math.round(percentage)}%`}
        </div>
      )}
    </div>
  );
};
