import { useState, useEffect } from 'react';
import { gameStore } from '../store';
import { Modal } from '../../design-system/Modal';
import { Button } from '../../design-system/Button';
import { CreditIcon } from '../../components/CreditIcon';
import { MILESTONES } from '../../lucky-boost/types';
import './RewardPopup.css';

export function RewardPopup() {
  const [gameState, setGameState] = useState(() => gameStore.getState());

  useEffect(() => {
    const unsubscribe = gameStore.subscribe(() => {
      setGameState(gameStore.getState());
    });
    return unsubscribe;
  }, []);

  if (!gameState.showRewardPopup) {
    return null;
  }

  const handleKeepPlaying = () => {
    gameStore.claimReward('credits');
  };

  // Show current reward (milestone just claimed), not next reward
  const claimedVariantId = gameState.claimedRewardVariantId ??
                           gameState.pendingLuckyBoostUpdate?.selectedMilestoneVariant ??
                           gameState.pendingLuckyBoostUpdate?.milestonesReached?.[0] ??
                           1;
  const milestone = MILESTONES.find(m => m.id === claimedVariantId);
  const rewardAmount = milestone?.reward.credits ?? 25; // Default to $25 if not found

  return (
    <Modal isOpen={true} onClose={() => {}}>
      <div className="reward-popup">
        <div className="reward-header">
          <img 
            src="/lucky-boost-logo.png" 
            alt="Lucky Boost" 
            className="reward-logo"
          />
          <h2>Your Lucky Boost is fully charged!</h2>
          <div className="reward-earned">
            <span className="reward-earned-label">You've earned</span>
            <CreditIcon size={12} className="reward-currency-icon" />
            <span className="reward-earned-amount">${rewardAmount.toFixed(2)}</span>
          </div>
        </div>

        <Button
          variant="primary"
          size="large"
          onClick={handleKeepPlaying}
          className="reward-keep-playing-button"
        >
          Keep playing
        </Button>
      </div>
    </Modal>
  );
}
