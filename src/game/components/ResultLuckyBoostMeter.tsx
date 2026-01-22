import { useEffect, useMemo } from 'react';
import { Tooltip } from '../../design-system/Tooltip';
import { CreditIcon } from '../../components/CreditIcon';
import { getCurrentMilestone, MILESTONES, MAX_PROGRESS, getProgressPercentage } from '../../lucky-boost/types';
import './ResultLuckyBoostMeter.css';

interface ResultLuckyBoostMeterProps {
  progress: number; // 0-100 (current progress)
  previousProgress: number; // 0-100 (progress before this pack open)
  progressAdded: number; // The amount of progress added in dollars (from calculateProgress)
  isFull: boolean;
  onDismiss?: () => void;
}

export function ResultLuckyBoostMeter({ progress, previousProgress, progressAdded, isFull }: ResultLuckyBoostMeterProps) {
  const percentage = Math.min(100, Math.max(0, progress));

  const nextReward = useMemo(() => {
    if (isFull) return null;
    const rawProgress = (percentage / 100) * MAX_PROGRESS;
    const current = getCurrentMilestone(rawProgress);
    const next = current
      ? MILESTONES.find((m) => m.id === current.id + 1)
      : MILESTONES[0];
    return next ?? null;
  }, [percentage, isFull]);

  useEffect(() => {
    if (isFull) {
      // Light-up animation when full
      const element = document.querySelector('.result-lucky-boost-meter');
      if (element) {
        element.classList.add('meter-full');
      }
    }
  }, [isFull]);

  // Convert progressAdded from dollars to percentage
  const progressAddedPercentage = getProgressPercentage(progressAdded);
  
  // Calculate the increased zone (the new progress added)
  const increasedZoneStart = previousProgress;
  const increasedZoneEnd = percentage;
  const increasedZoneWidth = Math.max(0, increasedZoneEnd - increasedZoneStart);
  
  // Calculate target progress (where the bar will end up) for the hint preview
  // This should match the final progress value
  const targetProgress = Math.min(100, Math.max(0, previousProgress + progressAddedPercentage));

  const tooltipContent = progressAdded > 0 ? (
    <div className="result-meter-tooltip">
      +{progressAddedPercentage.toFixed(1)}%
    </div>
  ) : null;

  return (
    <div className={`result-lucky-boost-meter ${isFull ? 'meter-full' : ''}`}>
      <div className="result-meter-container">
        {/* Lucky Boost Logo and Next Reward */}
        <div className="result-meter-header">
          <img 
            src="/lucky-boost-logo.png" 
            alt="Lucky Boost" 
            className="result-meter-logo"
          />
          {nextReward && (
            <div className="result-meter-next-reward">
              <span className="result-meter-next-reward-label">Next reward</span>
              <CreditIcon size={14} />
              <span className="result-meter-next-reward-amount">
                {nextReward.reward.credits != null
                  ? `$${nextReward.reward.credits.toFixed(2)}`
                  : nextReward.reward.guaranteedPull != null
                    ? `≥$${nextReward.reward.guaranteedPull.minValue.toFixed(2)}`
                    : ''}
              </span>
            </div>
          )}
        </div>

        {/* Progress Bar Container */}
        <div className="result-meter-progress-container">
          <div className="result-meter-progress-bar">
            {/* Background */}
            <div className="result-meter-progress-bg"></div>
            
            {/* Hint/preview bar showing target progress at 20% opacity */}
            {progressAdded > 0 && (
              <div 
              className="result-meter-progress-hint"
              style={{ width: `${targetProgress}%` }}
            />
            )}
            
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
