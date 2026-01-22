import { gameStore } from '../store';
import { Modal } from '../../design-system/Modal';
import { Button } from '../../design-system/Button';
import { CreditIcon } from '../../components/CreditIcon';
import './RewardPopup.css';

export function RewardPopup() {
  const state = gameStore.getState();

  if (!state.showRewardPopup) {
    return null;
  }

  const handleKeepPlaying = () => {
    gameStore.claimReward('credits');
  };

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
            <span className="reward-earned-amount">$25.00</span>
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
