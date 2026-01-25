import React, { useMemo, useState, useEffect } from 'react';
import { Tooltip } from '../design-system/Tooltip';
import { useLuckyBoost } from './useLuckyBoost';
import { getProgressPercentage, MILESTONES } from './types';
import { LuckyBoostIcon } from './LuckyBoostIcon';
import { CreditIcon } from '../components/CreditIcon';
import { LuckyBoostLogo } from '../components/LuckyBoostLogo';
import { gameStore } from '../game/store';
import './LuckyBoostHeaderMeter.css';

interface LuckyBoostHeaderMeterProps {
  progress: number; // 0-100
}

export const LuckyBoostHeaderMeter: React.FC<LuckyBoostHeaderMeterProps> = ({ progress }) => {
  const state = useLuckyBoost();
  const [gameState, setGameState] = useState(gameStore.getState());
  const percentage = getProgressPercentage(progress);
  
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
    <Tooltip content={tooltipContent} position="bottom" persistOnClick={true}>
      <div className="lucky-boost-header-meter">
        <LuckyBoostIcon percentage={percentage} size={40} />
      </div>
    </Tooltip>
  );
};
