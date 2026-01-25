import React, { useState, useEffect } from 'react';
import { Modal } from '../design-system/Modal';
import { Tabs } from '../design-system/Tabs';
import { Progress } from '../design-system/Progress';
import { Button } from '../design-system/Button';
import { useLuckyBoost } from './useLuckyBoost';
import {
  getProgressPercentage,
  getCurrentMilestone,
  MILESTONES,
  PackOpenResult,
} from './types';
import { formatCurrency } from '../utils/formatCurrency';
import { CreditIcon } from '../components/CreditIcon';
import { gameStore } from '../game/store';
import './LuckyBoostModal.css';

interface LuckyBoostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LuckyBoostModal: React.FC<LuckyBoostModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState('next-prize');
  const state = useLuckyBoost();
  const [gameState, setGameState] = useState(gameStore.getState());
  const percentage = getProgressPercentage(state.currentProgress);
  const currentMilestone = getCurrentMilestone(state.currentProgress);
  
  useEffect(() => {
    const unsubscribe = gameStore.subscribe(() => {
      setGameState(gameStore.getState());
    });
    return unsubscribe;
  }, []);
  
  // Pre-calculated next reward (exact amount, never a range)
  const nextRewardVariantId = gameState.nextRewardVariantId ?? 1;
  const nextRewardAmount = MILESTONES.find(m => m.id === nextRewardVariantId)?.reward.credits ?? 25;


  const upcomingMilestones = MILESTONES.filter(
    (m) => !currentMilestone || m.id > currentMilestone.id
  ).slice(0, 3);


  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const tabs = [
    {
      id: 'next-prize',
      label: 'Next Prize',
      content: (
        <div className="lucky-boost-modal-content">
          <div className="modal-description">
            <p>
              Cold streaks charge Lucky Boost. The fuller it is, the better your
              next pull's odds. Triggers once, then resets.
            </p>
            <p className="modal-note">
              Progress is based on recent results. Exact odds aren't shown.
            </p>
          </div>
          <div className="modal-progress-section">
            <h3 className="progress-label">Your progress</h3>
            <div className="progress-container">
              <Progress value={percentage} max={100} />
              <div className="progress-info">
                <span className="progress-percentage">{Math.round(percentage)}%</span>
                {percentage < 100 && (
                  <div className="next-reward">
                    <span>Next reward</span>
                    <CreditIcon size={14} />
                    <span>${nextRewardAmount.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="milestone-ladder">
              <h4 className="ladder-title">Milestone Ladder</h4>
              {upcomingMilestones.map((milestone) => {
                const isCurrent = currentMilestone?.id === milestone.id;
                const isPast = currentMilestone && milestone.id < currentMilestone.id;
                return (
                  <div
                    key={milestone.id}
                    className={`milestone-item ${isCurrent ? 'current' : ''} ${isPast ? 'past' : ''}`}
                  >
                    <div className="milestone-info">
                      <span className="milestone-number">{milestone.id}</span>
                      <div className="milestone-reward">
                        {milestone.reward.credits ? (
                          <>
                            <CreditIcon size={14} />
                            <span>${milestone.reward.credits.toFixed(2)} credits</span>
                          </>
                        ) : (
                          <>
                            <span>1 guaranteed pull</span>
                            <span>≥${milestone.reward.guaranteedPull?.minValue.toFixed(2)}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="milestone-range">
                      {milestone.start} → {milestone.end}
                    </div>
                  </div>
                );
              })}
            </div>
            <Button onClick={onClose}>Play now</Button>
          </div>
        </div>
      ),
    },
    {
      id: 'history',
      label: 'History',
      content: (
        <div className="history-content">
          {state.history.length === 0 ? (
            <p className="empty-state">No pack opens yet</p>
          ) : (
            <div className="history-list">
              {state.history
                .slice()
                .reverse()
                .map((entry: PackOpenResult) => (
                  <div key={entry.id} className="history-item">
                    <div className="history-main">
                      <div className="history-result">
                        <span
                          className={`result-badge ${entry.isWin ? 'win' : 'loss'}`}
                        >
                          {entry.isWin ? 'Win' : 'Loss'}
                        </span>
                        <span className="history-value">
                          Pack: ${formatCurrency(entry.packPrice)} → Card: $
                          {formatCurrency(entry.cardValue)}
                        </span>
                      </div>
                      <div className="history-progress">
                        +{entry.progressAdded} Lucky Boost
                      </div>
                    </div>
                    <div className="history-time">{formatDate(entry.timestamp)}</div>
                  </div>
                ))}
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'rules',
      label: 'Rules',
      content: (
        <div className="rules-content">
          <h3>How Lucky Boost Works</h3>
          <p>
            Lucky Boost charges up when you experience losses. The more you lose,
            the faster it charges.
          </p>
          <h4>Progress Formula</h4>
          <div className="formula-box">
            <p>
              <strong>Progress for losses:</strong> pack price - card value (in dollars)
            </p>
            <p>
              <strong>Progress for wins:</strong> 0 (wins don't add progress)
            </p>
            <p>
              <strong>Meter:</strong> $1000 = 100% (full meter)
            </p>
            <p>
              <strong>Example:</strong> Opening a $25 pack and getting a $10 card adds $15 to your progress
            </p>
          </div>
          <h4>Win/Loss Determination</h4>
          <p>
            A pack is considered a <strong>win</strong> if the revealed card value
            is greater than or equal to the pack price. Otherwise, it's a{' '}
            <strong>loss</strong>.
          </p>
          <p>
            If multiple cards are revealed in one pack, we use the{' '}
            <strong>highest value card</strong> for win/loss determination.
          </p>
          <h4>Milestones</h4>
          <p>
            When you reach a milestone, you earn rewards. Progress carries over to
            the next milestone—it doesn't reset to zero.
          </p>
          <h4>Overflow</h4>
          <p>
            If progress exceeds a milestone cap, the excess carries to the next
            milestone. If you hit multiple milestones from one pack, all rewards are
            granted sequentially.
          </p>
        </div>
      ),
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="LUCKY BOOST"
      className="lucky-boost-modal"
    >
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
    </Modal>
  );
};
