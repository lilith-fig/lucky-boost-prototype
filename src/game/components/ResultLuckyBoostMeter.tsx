import { useEffect } from 'react';
import { Tooltip } from '../../design-system/Tooltip';
import './ResultLuckyBoostMeter.css';

interface ResultLuckyBoostMeterProps {
  progress: number; // 0-100 (current progress)
  previousProgress: number; // 0-100 (progress before this pack open)
  progressAdded: number; // The amount of progress added from this pack open
  isFull: boolean;
  onDismiss?: () => void;
}

export function ResultLuckyBoostMeter({ progress, previousProgress, progressAdded, isFull }: ResultLuckyBoostMeterProps) {
  const percentage = Math.min(100, Math.max(0, progress));

  useEffect(() => {
    if (isFull) {
      // Light-up animation when full
      const element = document.querySelector('.result-lucky-boost-meter');
      if (element) {
        element.classList.add('meter-full');
      }
    }
  }, [isFull]);

  // Calculate the increased zone (the new progress added)
  const increasedZoneStart = previousProgress;
  const increasedZoneEnd = percentage;
  const increasedZoneWidth = Math.max(0, increasedZoneEnd - increasedZoneStart);

  const tooltipContent = progressAdded > 0 ? (
    <div className="result-meter-tooltip">
      +{progressAdded}%
    </div>
  ) : null;

  return (
    <div className={`result-lucky-boost-meter ${isFull ? 'meter-full' : ''}`}>
      <div className="result-meter-container">
        {/* Lucky Boost Logo */}
        <div className="result-meter-header">
          <img 
            src="/lucky-boost-logo.png" 
            alt="Lucky Boost" 
            className="result-meter-logo"
          />
        </div>

        {/* Progress Bar Container */}
        <div className="result-meter-progress-container">
          <div className="result-meter-progress-bar">
            {/* Background */}
            <div className="result-meter-progress-bg"></div>
            
            {/* Total progress fill (existing + new) */}
            <div 
              className="result-meter-progress-fill"
              style={{ width: `${percentage}%` }}
            />
            
            {/* Increased zone (new progress) with tooltip - overlays on top */}
            {progressAdded > 0 && increasedZoneWidth > 0 && (
              <Tooltip 
                content={tooltipContent}
                position="top"
                className="result-meter-tooltip-wrapper"
              >
                <div 
                  className="result-meter-progress-increased"
                  style={{ 
                    width: `${increasedZoneWidth}%`,
                    left: `${increasedZoneStart}%`
                  }}
                />
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
