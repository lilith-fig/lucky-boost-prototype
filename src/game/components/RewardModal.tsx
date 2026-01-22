import { Modal } from '../../design-system/Modal';
import { Button } from '../../design-system/Button';
import './RewardModal.css';

interface RewardModalProps {
  onClose: () => void;
}

export function RewardModal({ onClose }: RewardModalProps) {
  return (
    <Modal isOpen={true} onClose={onClose} className="reward-modal">
      <div className="reward-modal-content">
        <div className="reward-visual">
          <div className="reward-icon-large">🎉</div>
          <div className="reward-glow"></div>
        </div>
        
        <div className="reward-text">
          <h2 className="reward-title">Lucky Boost Complete!</h2>
          <p className="reward-description">
            You've reached 100% Lucky Boost progress
          </p>
        </div>

        <div className="reward-amount">
          <div className="reward-amount-label">Reward</div>
          <div className="reward-amount-value">+$25</div>
        </div>

        <Button
          variant="primary"
          size="large"
          onClick={onClose}
          className="reward-cta"
        >
          Claim Reward
        </Button>
      </div>
    </Modal>
  );
}
