import { Modal } from '../../design-system/Modal';
import { Button } from '../../design-system/Button';
import { CreditIcon } from '../../components/CreditIcon';
import './RewardModal.css';

interface RewardModalProps {
  onClose: () => void;
}

export function RewardModal({ onClose }: RewardModalProps) {
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
            <div className="reward-amount-value">+$25</div>
          </div>
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
