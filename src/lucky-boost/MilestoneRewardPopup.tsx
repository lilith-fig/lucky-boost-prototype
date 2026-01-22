import React, { useEffect, useState } from 'react';
import { Modal } from '../design-system/Modal';
import { Button } from '../design-system/Button';
import { MILESTONES } from './types';
import { luckyBoostStore } from './store';
import './MilestoneRewardPopup.css';

interface MilestoneRewardPopupProps {
  milestoneId: number;
  onClaim: () => void;
  onClose: () => void;
}

export const MilestoneRewardPopup: React.FC<MilestoneRewardPopupProps> = ({
  milestoneId,
  onClaim,
  onClose,
}) => {
  const [isAnimating, setIsAnimating] = useState(true);
  const milestone = MILESTONES.find((m) => m.id === milestoneId);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!milestone) return null;

  const handleClaim = () => {
    luckyBoostStore.claimMilestone(milestoneId);
    onClaim();
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Milestone Reached!">
      <div className={`milestone-reward-content ${isAnimating ? 'animating' : ''}`}>
        <div className="reward-icon">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <circle
              cx="32"
              cy="32"
              r="30"
              stroke="url(#rewardGradient)"
              strokeWidth="4"
            />
            <path
              d="M32 16L36 28L48 28L38 36L42 48L32 40L22 48L26 36L16 28L28 28L32 16Z"
              fill="url(#rewardGradient)"
            />
            <defs>
              <linearGradient id="rewardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d3f015" />
                <stop offset="100%" stopColor="#ff6b00" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <h2 className="reward-title">Milestone {milestone.id} Complete!</h2>
        <div className="reward-details">
          {milestone.reward.credits ? (
            <div className="reward-credits">
              <span className="currency-icon-large">$</span>
              <span className="reward-amount">${milestone.reward.credits.toFixed(2)}</span>
              <span className="reward-label">Credits</span>
            </div>
          ) : (
            <div className="reward-guaranteed">
              <span className="reward-label">1 Guaranteed Pull</span>
              <span className="reward-min-value">
                Minimum Value: ${milestone.reward.guaranteedPull?.minValue.toFixed(2)}
              </span>
            </div>
          )}
        </div>
        <div className="reward-actions">
          <Button onClick={handleClaim} variant="primary" size="large">
            Claim Reward
          </Button>
          <Button onClick={onClose} variant="secondary" size="medium">
            View Details
          </Button>
        </div>
      </div>
    </Modal>
  );
};
