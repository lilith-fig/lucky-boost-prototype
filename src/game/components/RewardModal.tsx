import { useEffect } from 'react';
import { Modal } from '../../design-system/Modal';
import { Button } from '../../design-system/Button';
import { CreditIcon } from '../../components/CreditIcon';
import { MILESTONES } from '../../lucky-boost/types';
import { gameStore } from '../store';
import { useSFX } from '../../audio/useAudio';
import './RewardModal.css';

interface RewardModalProps {
  onClose: () => void;
}

export function RewardModal({ onClose }: RewardModalProps) {
  const sfx = useSFX();
  // Get the selected milestone variant from pending update, or default to variant 1
  const state = gameStore.getState();
  const selectedVariantId = state.pendingLuckyBoostUpdate?.selectedMilestoneVariant || 
                            state.pendingLuckyBoostUpdate?.milestonesReached?.[0] || 
                            1;
  const milestone = MILESTONES.find(m => m.id === selectedVariantId);
  const rewardAmount = milestone?.reward.credits || 25; // Default to $25 if not found

  useEffect(() => {
    // Play reward popup sound when modal opens
    sfx.play('rewardPopup');
  }, [sfx]);

  return (
    <Modal isOpen={true} onClose={onClose} className="reward-modal">
      <div className="reward-modal-content">
        <img 
          src="/lucky-boost-logo.png" 
          alt="Lucky Boost" 
          className="reward-logo"
        />

        <div className="reward-amount">
          <div className="reward-amount-label">Your Lucky Boost is fully charged!</div>
          <div className="reward-earned">
            <span className="reward-earned-label">You've earned</span>
            <CreditIcon size={12} className="reward-currency-icon" />
            <div className="reward-amount-value">+${rewardAmount}</div>
          </div>
        </div>

        <Button
          variant="primary"
          size="large"
          onClick={() => {
            sfx.play('buttonClick');
            onClose();
          }}
          className="reward-cta"
        >
          Claim Reward
        </Button>
      </div>
    </Modal>
  );
}
