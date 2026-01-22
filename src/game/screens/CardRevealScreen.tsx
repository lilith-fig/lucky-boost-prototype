import { useEffect, useState, useMemo } from 'react';
import { gameStore } from '../store';
import { ResultLuckyBoostMeter } from '../components/ResultLuckyBoostMeter';
import { RewardModal } from '../components/RewardModal';
import { Button } from '../../design-system/Button';
import { getRandomCardImageUrl } from '../utils/cardImages';
import { formatCurrency } from '../../utils/formatCurrency';
import { CountUpNumber } from '../../components/CountUpNumber';
import { calculateProgress, getProgressPercentage } from '../../lucky-boost/types';
import { luckyBoostStore } from '../../lucky-boost/store';
import './CardRevealScreen.css';

export function CardRevealScreen() {
  const state = gameStore.getState();
  const [showPrice, setShowPrice] = useState(false);
  const [showMeter, setShowMeter] = useState(false);
  const [meterProgress, setMeterProgress] = useState(0);
  const [previousProgress, setPreviousProgress] = useState(0);
  const [progressAdded, setProgressAdded] = useState(0);
  const [isMeterFull, setIsMeterFull] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [showKeepSell, setShowKeepSell] = useState(false);
  const [isSelling, setIsSelling] = useState(false);
  const result = state.lastResult;

  useEffect(() => {
    if (!result) {
      gameStore.navigateTo('home');
      return;
    }

    // Calculate progress added from this pack open
    const calculatedProgressAdded = calculateProgress(
      result.packPrice,
      result.card.value
    );
    setProgressAdded(calculatedProgressAdded);

    // Get the actual current progress from lucky boost store (before pending update is applied)
    const currentLuckyBoostState = luckyBoostStore.getState();
    const previousProgressPercentage = getProgressPercentage(currentLuckyBoostState.currentProgress);
    setPreviousProgress(previousProgressPercentage);

    // The target progress is what's calculated in gameStore (for display)
    const targetProgress = state.luckyBoostProgress;

    // Stage 1: Show price after card is revealed (800ms delay)
    const priceDelay = setTimeout(() => {
      setShowPrice(true);
    }, 800);

    // Stage 2: Show actions smoothly right after price appears (parallel with meter)
    const actionsDelay = setTimeout(() => {
      setShowKeepSell(true);
    }, 1200); // 800ms (price) + 400ms (smooth transition)

    // Stage 3: Show meter in parallel (doesn't block actions)
    const meterDelay = setTimeout(() => {
      setShowMeter(true);
      
      // Animate meter fill with smooth stacking animation
      const targetProgressValue = targetProgress;
      const duration = 1800; // 1.8s fill animation for smooth feel
      const startTime = Date.now();
      const startProgressValue = previousProgressPercentage;

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
          // After meter animation completes, apply pending store updates
          // This updates the header icon without spoiling the result
          gameStore.applyPendingLuckyBoostUpdate();

          // Check if meter is full
          if (targetProgressValue >= 100) {
            setIsMeterFull(true);
            // Show reward modal after light-up animation completes
            setTimeout(() => {
              setShowRewardModal(true);
            }, 1200);
          } else {
            // Auto-dismiss meter after animation completes (actions already shown)
            setTimeout(() => {
              setShowMeter(false);
            }, 1000);
          }
        }
      };

      requestAnimationFrame(animate);
    }, 1400); // 800ms (price) + 600ms (meter delay) - runs in parallel with actions

    return () => {
      clearTimeout(priceDelay);
      clearTimeout(actionsDelay);
      clearTimeout(meterDelay);
    };
  }, [result, state.luckyBoostProgress]);

  const handleRewardClose = () => {
    setShowRewardModal(false);
    gameStore.claimRewardCreditsOnly();
    // Actions are already shown, no need to delay
    if (!showKeepSell) {
      setShowKeepSell(true);
    }
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
          {showPrice && (
            <div className="card-price">
              $<CountUpNumber value={card.value} duration={1000} />
            </div>
          )}
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
              onClick={() => {
                setIsSelling(true);
                // Wait 2 seconds before navigating
                setTimeout(() => {
                  gameStore.sellCard();
                }, 2000);
              }}
              className={isSelling ? 'btn-loading' : ''}
              disabled={isSelling}
            >
              {isSelling ? 'Selling...' : `Sell for ${formatCurrency(card.value)}`}
            </Button>
          </div>
        )}
      </div>

      {/* Lucky Boost Meter - appears in corner (runs in parallel, doesn't block actions) */}
      {showMeter && (
        <ResultLuckyBoostMeter
          progress={meterProgress}
          previousProgress={previousProgress}
          progressAdded={progressAdded}
          isFull={isMeterFull}
          onDismiss={() => {
            if (!isMeterFull) {
              setShowMeter(false);
              // Actions are already shown independently, no need to trigger them
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
