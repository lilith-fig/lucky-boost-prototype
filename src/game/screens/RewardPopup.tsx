import { gameStore } from '../store';
import { Modal } from '../../design-system/Modal';
import './RewardPopup.css';

export function RewardPopup() {
  const state = gameStore.getState();

  if (!state.showRewardPopup) {
    return null;
  }

  const handleClaimCredits = () => {
    gameStore.claimReward('credits');
  };

  const handleClaimGuaranteedPull = () => {
    gameStore.claimReward('guaranteedPull');
  };

  return (
    <Modal isOpen={true} onClose={() => {}}>
      <div className="reward-popup">
        <div className="reward-header">
          <div className="reward-icon">🎉</div>
          <h2>Lucky Boost Complete!</h2>
          <p>Choose your reward:</p>
        </div>

        <div className="reward-options">
          <button
            className="reward-option"
            onClick={handleClaimCredits}
          >
            <div className="reward-option-icon">💰</div>
            <div className="reward-option-content">
              <h3>+$25.00 Credits</h3>
              <p>Add credits to your balance</p>
            </div>
          </button>

          <button
            className="reward-option"
            onClick={handleClaimGuaranteedPull}
          >
            <div className="reward-option-icon">✨</div>
            <div className="reward-option-content">
              <h3>1 Guaranteed Pull</h3>
              <p>Open a pack with guaranteed value</p>
            </div>
          </button>
        </div>
      </div>
    </Modal>
  );
}
