import React from 'react';
import { Tooltip } from '../design-system/Tooltip';
import { useLuckyBoost } from './useLuckyBoost';
import { getProgressPercentage, getCurrentMilestone, MILESTONES } from './types';
import { LuckyBoostIcon } from './LuckyBoostIcon';
import { CreditIcon } from '../components/CreditIcon';
import { LuckyBoostLogo } from '../components/LuckyBoostLogo';
import './LuckyBoostHeaderMeter.css';

interface LuckyBoostHeaderMeterProps {
  progress: number; // 0-100
}

export const LuckyBoostHeaderMeter: React.FC<LuckyBoostHeaderMeterProps> = ({ progress }) => {
  const state = useLuckyBoost();
  const percentage = getProgressPercentage(progress);
  const milestone = getCurrentMilestone(progress);
  const nextMilestone = milestone
    ? MILESTONES.find((m) => m.id === milestone.id + 1)
    : MILESTONES[0];

  const tooltipContent = (
    <div className="lucky-boost-tooltip-content">
      <div className="tooltip-header">
        <LuckyBoostLogo size={24} />
      </div>
      <p className="tooltip-description">
        Cold streaks charge Lucky Boost. The fuller it is, the better your next pull's odds. Triggers once, then resets.
      </p>
      <p className="tooltip-note">
        Progress is based on recent results. Exact odds aren't shown.
      </p>
      <div className="tooltip-progress-section">
        <div className="tooltip-progress-bar">
          <div
            className="tooltip-progress-fill"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="tooltip-progress-info">
          <span className="tooltip-progress-percentage">
            {Math.round(percentage)}%
          </span>
          {nextMilestone && (
            <div className="tooltip-next-reward">
              <span>Next reward</span>
              <CreditIcon size={14} />
              <span>
                {nextMilestone.reward.credits
                  ? `$${nextMilestone.reward.credits.toFixed(2)}`
                  : `≥$${nextMilestone.reward.guaranteedPull?.minValue.toFixed(2)}`}
              </span>
            </div>
          )}
        </div>
      </div>
      {state.lastProgressAdded && (
        <p className="tooltip-last-update">
          Last update: +{state.lastProgressAdded} from last pack
        </p>
      )}
    </div>
  );

  return (
    <Tooltip content={tooltipContent} position="bottom" persistOnClick={true}>
      <div className="lucky-boost-header-meter">
        <LuckyBoostIcon percentage={percentage} size={40} />
      </div>
    </Tooltip>
  );
};
