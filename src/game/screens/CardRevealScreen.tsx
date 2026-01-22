import { useEffect, useState, useMemo } from 'react';
import { gameStore } from '../store';
import { ResultLuckyBoostMeter } from '../components/ResultLuckyBoostMeter';
import { RewardModal } from '../components/RewardModal';
import { Button } from '../../design-system/Button';
import { getRandomCardImageUrl } from '../utils/cardImages';
import { formatCurrency } from '../../utils/formatCurrency';
import './CardRevealScreen.css';

export function CardRevealScreen() {
  const state = gameStore.getState();
  const [showMeter, setShowMeter] = useState(false);
  const [meterProgress, setMeterProgress] = useState(0);
  const [previousProgress, setPreviousProgress] = useState(0);
  const [progressAdded, setProgressAdded] = useState(0);
  const [isMeterFull, setIsMeterFull] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [showKeepSell, setShowKeepSell] = useState(false);
  const result = state.lastResult;

  useEffect(() => {
    if (!result) {
      gameStore.navigateTo('home');
      return;
    }

    // Calculate progress added from this pack open
    const calculatedProgressAdded = gameStore.calculateLuckyBoostProgress(
      result.packPrice,
      result.card.value
    );
    setProgressAdded(calculatedProgressAdded);

    // Calculate previous progress (current progress minus what was just added)
    const currentProgress = state.luckyBoostProgress;
    const prevProgress = Math.max(0, currentProgress - calculatedProgressAdded);
    setPreviousProgress(prevProgress);

    // Show meter after a brief delay
    const meterDelay = setTimeout(() => {
      setShowMeter(true);
      
      // Animate meter fill with smooth stacking animation
      const targetProgressValue = currentProgress;
      const duration = 1800; // 1.8s fill animation for smooth feel
      const startTime = Date.now();
      const startProgressValue = prevProgress;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease-out cubic for smooth deceleration (non-linear as per requirements)
        const eased = 1 - Math.pow(1 - progress, 3);
        const animatedProgress = startProgressValue + (targetProgressValue - startProgressValue) * eased;
        
        setMeterProgress(animatedProgress);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Check if meter is full
          if (targetProgressValue >= 100) {
            setIsMeterFull(true);
            // Show reward modal after light-up animation completes
            setTimeout(() => {
              setShowRewardModal(true);
            }, 1200);
          } else {
            // Auto-dismiss meter after animation completes, then show Keep/Sell on this screen
            setTimeout(() => {
              setShowMeter(false);
              setTimeout(() => setShowKeepSell(true), 400);
            }, 1000);
          }
        }
      };

      requestAnimationFrame(animate);
    }, 500); // Delay before showing meter

    return () => clearTimeout(meterDelay);
  }, [result, state.luckyBoostProgress]);

  const handleRewardClose = () => {
    setShowRewardModal(false);
    gameStore.claimRewardCreditsOnly();
    setTimeout(() => setShowKeepSell(true), 300);
  };

  if (!result) {
    return null;
  }

  const { card, theme } = result;
  const cardImageUrl = useMemo(() => getRandomCardImageUrl(theme), [theme]);

  return (
    <div className="card-reveal-screen">
      {/* Background overlay with gradient */}
      <div className="result-background">
        <div className="result-overlay"></div>
      </div>

      {/* Card presentation - primary focus */}
      <div className="card-presentation">
        <div className="card-container">
          {cardImageUrl ? (
            <img
              src={cardImageUrl}
              alt={card.name}
              className="card-image"
            />
          ) : null}
          <div className="card-price">
            ${formatCurrency(card.value)}
          </div>
        </div>

        {showKeepSell && (
          <div className="card-reveal-actions">
            <Button
              variant="secondary"
              size="large"
              onClick={() => gameStore.keepCard()}
            >
              Keep
            </Button>
            <Button
              variant="primary"
              size="large"
              onClick={() => gameStore.sellCard()}
            >
              Sell for ${formatCurrency(card.value)}
            </Button>
          </div>
        )}
      </div>

      {/* Lucky Boost Meter - appears in corner */}
      {showMeter && (
        <ResultLuckyBoostMeter
          progress={meterProgress}
          previousProgress={previousProgress}
          progressAdded={progressAdded}
          isFull={isMeterFull}
          onDismiss={() => {
            if (!isMeterFull) {
              setShowMeter(false);
              setShowKeepSell(true);
            }
          }}
        />
      )}

      {/* Reward Modal - shows when meter reaches 100% */}
      {showRewardModal && (
        <RewardModal onClose={handleRewardClose} />
      )}
    </div>
  );
}
