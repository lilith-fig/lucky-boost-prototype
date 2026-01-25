import React, { useMemo, useState, useEffect } from 'react';
import { Tooltip } from '../design-system/Tooltip';
import { useLuckyBoost } from './useLuckyBoost';
import { getProgressPercentage, getCurrentMilestone, MILESTONES } from './types';
import { LuckyBoostIcon } from './LuckyBoostIcon';
import { CreditIcon } from '../components/CreditIcon';
import { gameStore } from '../game/store';
import './LuckyBoostHeader.css';

interface LuckyBoostHeaderProps {
  onClick?: () => void;
}

export const LuckyBoostHeader: React.FC<LuckyBoostHeaderProps> = ({ onClick }) => {
  const state = useLuckyBoost();
  const [gameState, setGameState] = useState(gameStore.getState());
  const percentage = getProgressPercentage(state.currentProgress);
  const milestone = getCurrentMilestone(state.currentProgress);
  
  useEffect(() => {
    const unsubscribe = gameStore.subscribe(() => {
      setGameState(gameStore.getState());
    });
    return unsubscribe;
  }, []);
  
  // Pre-calculated next reward (exact amount, never a range)
  const nextRewardVariantId = gameState.nextRewardVariantId ?? 1;
  const nextRewardAmount = MILESTONES.find(m => m.id === nextRewardVariantId)?.reward.credits ?? 25;

  const tooltipContent = useMemo(() => (
    <div className="lucky-boost-tooltip-content">
      <div className="tooltip-header">
        <div className="tooltip-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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
        <span className="tooltip-title">Lucky Boost</span>
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
          {percentage < 100 && (
            <div className="tooltip-next-reward">
              <span>Next reward</span>
              <CreditIcon size={14} />
              <span>${nextRewardAmount.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>
      {state.lastProgressAdded && (
        <p className="tooltip-last-update">
          Last update: +{getProgressPercentage(state.lastProgressAdded).toFixed(1)}% from last pack
        </p>
      )}
    </div>
  ), [percentage, nextRewardAmount, state.lastProgressAdded]);

  return (
    <Tooltip content={tooltipContent} position="bottom">
      <button
        className="lucky-boost-header"
        onClick={onClick}
        aria-label="Lucky Boost"
      >
        <LuckyBoostIcon percentage={percentage} size={32} />
        <div className="header-label">Lucky Boost</div>
        <div className="header-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="progress-percentage">{Math.round(percentage)}%</div>
        </div>
      </button>
    </Tooltip>
  );
};
