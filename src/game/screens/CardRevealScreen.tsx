import { useEffect, useState, useMemo, useRef } from 'react';
import { gameStore } from '../store';
import { toastStore } from '../../toastStore';
import { ResultLuckyBoostMeter } from '../components/ResultLuckyBoostMeter';
import { RewardModal } from '../components/RewardModal';
import { Button } from '../../design-system/Button';
import { getRandomCardImageUrl } from '../utils/cardImages';
import { formatCurrency } from '../../utils/formatCurrency';
import { CountUpNumber } from '../../components/CountUpNumber';
import { calculateProgress, getProgressPercentage } from '../../lucky-boost/types';
import { luckyBoostStore } from '../../lucky-boost/store';
import { useSFX, useAudio } from '../../audio/useAudio';
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
  const [hasSold, setHasSold] = useState(false);
  const [hasKept, setHasKept] = useState(false);
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});
  const [glossStyle, setGlossStyle] = useState<React.CSSProperties>({});
  const [tiltEnabled, setTiltEnabled] = useState(false);
  const cardRef = useRef<HTMLImageElement>(null);
  const dismissTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cardRevealSoundPlayedRef = useRef<number | null>(null);
  const result = state.lastResult;
  const sfx = useSFX();
  const audio = useAudio();

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tiltEnabled || !cardRef.current) return;
    
    // NOTE: No SFX should be played during hover/tilt interactions
    // This handler only handles visual tilt and gloss effects
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = (e.clientX - centerX) / (rect.width / 2);
    const mouseY = (e.clientY - centerY) / (rect.height / 2);
    const tiltX = mouseY * 15;
    const tiltY = mouseX * -15;
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
    });
    
    // Calculate gloss angle based on tilt - mimics light reflection
    // The gloss should move opposite to the tilt direction
    const glossAngle = 160 + (tiltY * 0.5) + (tiltX * 0.3);
    const glossX = 50 + (mouseX * 30);
    const glossY = 50 + (mouseY * 30);
    setGlossStyle({
      background: `linear-gradient(${glossAngle}deg, rgba(217, 217, 217, 0.00) -0.53%, #F5FFE7 7.78%, rgba(217, 217, 217, 0.00) 23.15%, #D8F6FF 31.74%, rgba(231, 231, 231, 0.00) 42.74%, rgba(217, 217, 217, 0.00) 75.98%, #E8E5FF 81.55%, rgba(217, 217, 217, 0.00) 87.33%, rgba(252, 236, 255, 0.90) 91.46%, #D9D9D9 96.63%)`,
      backgroundSize: '150% 150%',
      backgroundPosition: `${glossX}% ${glossY}%`,
    });
  };

  const handleCardMouseLeave = () => {
    if (!tiltEnabled) return;
    
    // NOTE: No SFX should be played during hover/tilt interactions
    // This handler only resets visual tilt and gloss effects
    
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
    });
    setGlossStyle({
      background: `linear-gradient(160deg, rgba(217, 217, 217, 0.00) -0.53%, #F5FFE7 7.78%, rgba(217, 217, 217, 0.00) 23.15%, #D8F6FF 31.74%, rgba(231, 231, 231, 0.00) 42.74%, rgba(217, 217, 217, 0.00) 75.98%, #E8E5FF 81.55%, rgba(217, 217, 217, 0.00) 87.33%, rgba(252, 236, 255, 0.90) 91.46%, #D9D9D9 96.63%)`,
      backgroundSize: '150% 150%',
      backgroundPosition: '50% 50%',
    });
  };

  useEffect(() => {
    if (!result) {
      gameStore.navigateTo('home');
      return;
    }

    // Reset state when a new card is revealed
    setIsMeterFull(false);
    setShowRewardModal(false);

    // Only show meter and calculate progress if it's a loss (not a win)
    // Wins (20% of packs) don't show meter UI
    const isWin = result.isWin;

    // Play card-reveal.mp3 when card is actually revealed (not in tap-to-reveal screen)
    // Use ref to ensure it only plays once per card reveal, even if component re-renders due to hover/tilt
    // Reset ref when result changes (new card revealed)
    const resultId = result.timestamp; // Use timestamp as unique identifier for this card reveal
    if (cardRevealSoundPlayedRef.current !== resultId) {
      sfx.play('cardReveal');
      cardRevealSoundPlayedRef.current = resultId;
    }

    // Stage 1: Show price after card is revealed (800ms delay)
    const priceDelay = setTimeout(() => {
      setShowPrice(true);
    }, 800);

    // Stage 2: Show actions smoothly right after price appears
    const actionsDelay = setTimeout(() => {
      setShowKeepSell(true);
    }, 1200); // 800ms (price) + 400ms (smooth transition)

    // Stage 3: Show meter only if it's a loss (not a win)
    if (!isWin) {
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

      // Show meter in parallel (doesn't block actions)
      const meterDelay = setTimeout(() => {
        // First, set the meter to show current progress (starting point)
        setMeterProgress(previousProgressPercentage);
        setShowMeter(true);
        
        // Wait a brief moment so user can see the starting progress, then animate
        setTimeout(() => {
          // Animate meter fill with smooth stacking animation
          const targetProgressValue = targetProgress;
          const duration = 900; // 0.9s fill animation
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
              if (typeof gameStore.applyPendingLuckyBoostUpdate === 'function') {
                gameStore.applyPendingLuckyBoostUpdate();
              }

              // Check if meter is full
              if (targetProgressValue >= 100) {
                setIsMeterFull(true);
                // Play meter full sound
                sfx.play('meterFull');
                // Show reward modal after light-up animation completes
                // Only show if reward hasn't been claimed yet
                const currentState = gameStore.getState();
                if (!currentState.rewardClaimed) {
                  setTimeout(() => {
                    // Clear the old reward popup to prevent duplicate popups
                    // The RewardModal in CardRevealScreen will be shown instead
                    gameStore.clearRewardPopup();
                    setShowRewardModal(true);
                    // Play reward popup sound
                    sfx.play('rewardPopup');
                  }, 1200);
                }
              } else {
                // Play meter fill sound during animation
                sfx.play('meterFill', { volume: 0.5 });
              }
              
              // Always remain for 2s after animation ends, then dismiss
              if (dismissTimeoutRef.current) clearTimeout(dismissTimeoutRef.current);
              dismissTimeoutRef.current = setTimeout(() => {
                setShowMeter(false);
                dismissTimeoutRef.current = null;
              }, 2000);
            }
          };

          requestAnimationFrame(animate);
        }, 150); // Brief pause to show starting progress before animation
      }, 300); // Start meter sooner - runs in parallel with price/actions

      return () => {
        clearTimeout(priceDelay);
        clearTimeout(actionsDelay);
        clearTimeout(meterDelay);
        if (dismissTimeoutRef.current) {
          clearTimeout(dismissTimeoutRef.current);
          dismissTimeoutRef.current = null;
        }
      };
    } else {
      // Win: don't show meter, just return cleanup for price/actions
      return () => {
        clearTimeout(priceDelay);
        clearTimeout(actionsDelay);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, state.luckyBoostProgress]); // sfx removed - using ref to ensure sound only plays once

  useEffect(() => {
    const enableTilt = setTimeout(() => setTiltEnabled(true), 600);
    return () => clearTimeout(enableTilt);
  }, []);

  const handleRewardClose = () => {
    setShowRewardModal(false);
    gameStore.claimRewardCreditsOnly();
    // Reset isMeterFull to prevent showing modal again
    setIsMeterFull(false);
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
      {(hasSold || hasKept) && (
        <div className="card-reveal-pack-selection">
          <Button
            variant="secondary"
            size="medium"
            onClick={() => gameStore.navigateTo('home')}
          >
            Pack selection
          </Button>
        </div>
      )}
      {/* Background overlay with gradient */}
      <div className="result-background">
        <div className="result-overlay"></div>
      </div>

      {/* Card presentation - primary focus */}
      <div className="card-presentation">
        <div className="card-container">
          {cardImageUrl ? (
            <div 
              className="card-image-wrapper"
              style={tiltStyle}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              <img
                ref={cardRef}
                src={cardImageUrl}
                alt={card.name}
                className="card-image"
              />
              <div 
                className="card-gloss-layer"
                style={glossStyle}
              />
            </div>
          ) : null}
          {showPrice && (
            <div className="card-price">
              $<CountUpNumber value={card.value} duration={1000} />
            </div>
          )}
        </div>

        {showKeepSell && (
          <div className="card-reveal-actions">
            {!hasSold && !hasKept ? (
              <>
                <Button
                  variant="secondary"
                  size="large"
                  onClick={() => {
                    toastStore.showToast('Card added to your inventory');
                    gameStore.keepCard({ stayOnReveal: true });
                    setHasKept(true);
                    // Play card-kept.mp3 after clicking keep card
                    sfx.play('keepCard');
                  }}
                >
                  Keep
                </Button>
                <Button
                  variant="primary"
                  size="large"
                  onClick={() => {
                    setIsSelling(true);
                    setTimeout(() => {
                      // Actually sell the card to update balance
                      gameStore.sellCard({ stayOnReveal: true });
                      toastStore.showToast('Card sold successfully');
                      // Clear any old reward popup to prevent duplicate popups
                      gameStore.clearRewardPopup();
                      setIsSelling(false);
                      setHasSold(true);
                      // Play card-sold.mp3 right after button loading state ends
                      sfx.play('sellCard');
                      // Don't show RewardModal again after claiming - it should only show once after meter loads
                    }, 1000);
                  }}
                  className={isSelling ? 'btn-loading' : ''}
                  disabled={isSelling}
                >
                  {isSelling ? 'Selling...' : `Sell for $${formatCurrency(card.value)}`}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="secondary"
                  size="large"
                  onClick={() => {}}
                >
                  Flex
                </Button>
                <Button
                  variant="primary"
                  size="large"
                  onClick={() => {
                    sfx.play('buttonClick');
                    const pack = gameStore.getState().selectedPack;
                    if (!pack) return;
                    if (gameStore.getState().usdcBalance < pack.price) {
                      sfx.play('error');
                      alert('Insufficient USDC balance!');
                      return;
                    }
                    gameStore.navigateTo('opening');
                    setTimeout(() => {
                      gameStore.openPack(pack.id, Date.now());
                      gameStore.navigateTo('cardBack');
                    }, 2000);
                  }}
                >
                  Pull another
                </Button>
              </>
            )}
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

      {/* Reward Modal - shows when meter reaches 100% (only once, after meter loads) */}
      {showRewardModal && !gameStore.getState().rewardClaimed && (
        <RewardModal onClose={handleRewardClose} />
      )}

      {/* BGM Toggle Button */}
      <div className="card-reveal-bgm-toggle">
        <Button
          variant="secondary"
          size="medium"
          iconOnly={true}
          iconLeft={audio.state.bgmEnabled ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M17.5 5.52501C17.5 5.35905 17.4143 5.20287 17.2688 5.1038C17.1234 5.00474 16.9353 4.97446 16.7617 5.02215L9.11461 7.12215C8.87201 7.18877 8.70588 7.39316 8.70588 7.62501V14.5391C8.27236 14.2623 7.74512 14.1 7.17647 14.1C5.69829 14.1 4.5 15.1969 4.5 16.55C4.5 17.9031 5.69829 19 7.17647 19C8.65465 19 9.85294 17.9031 9.85294 16.55C9.85294 16.5098 9.85189 16.4699 9.8498 16.4302C9.85188 16.4121 9.85294 16.3936 9.85294 16.375V10.8156L16.3529 9.03062V13.1391C15.9194 12.8623 15.3922 12.7 14.8235 12.7C13.3454 12.7 12.1471 13.7969 12.1471 15.15C12.1471 16.5031 13.3454 17.6 14.8235 17.6C16.3017 17.6 17.5 16.5031 17.5 15.15C17.5 15.1099 17.4989 15.0699 17.4969 15.0303C17.4989 15.0121 17.5 14.9937 17.5 14.975V5.52501Z" fill="white"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 19 15" fill="none" aria-hidden>
              <path fillRule="evenodd" clipRule="evenodd" d="M13.9657 0.0399773C14.2769 -0.0454345 14.6178 0.00661559 14.8876 0.190368C15.1597 0.375892 15.3368 0.682577 15.3368 1.02533V10.4745C15.3368 10.4931 15.3349 10.5119 15.3339 10.5302C15.3356 10.5698 15.3368 10.6102 15.3368 10.6503C15.3368 10.7015 15.3356 10.7523 15.3329 10.8027L18.0917 12.456C18.3282 12.598 18.4053 12.9048 18.2636 13.1415C18.1217 13.3783 17.8148 13.455 17.578 13.3134L15.08 11.8163C14.5875 12.8801 13.4433 13.5995 12.16 13.5995C10.4486 13.5994 8.98451 12.3199 8.98426 10.6503C8.98426 9.87295 9.30334 9.18163 9.81532 8.66302L7.68934 7.38861V11.8749C7.68934 11.8909 7.68719 11.9068 7.68641 11.9228C7.68834 11.9649 7.68934 12.0072 7.68934 12.0497C7.68932 13.7195 6.22517 14.9997 4.51356 14.9999C2.80178 14.9999 1.33682 13.7197 1.3368 12.0497C1.33692 10.3799 2.80184 9.09955 4.51356 9.09955C4.87286 9.09959 5.21915 9.1568 5.54286 9.2597V6.10345L0.243051 2.92865C0.00616923 2.78674 -0.0707337 2.47999 0.0711763 2.2431C0.213105 2.00627 0.519858 1.92933 0.756723 2.07123L5.54286 4.93842V3.12494C5.54286 2.6424 5.88517 2.25878 6.31922 2.13959L13.9657 0.0399773ZM8.22938 6.54779L10.704 8.03021C11.144 7.81916 11.6404 7.70019 12.16 7.70013C12.5192 7.70015 12.8657 7.75652 13.1893 7.85931V5.18549L8.22938 6.54779Z" fill="white"/>
            </svg>
          )}
          onClick={() => audio.toggleBGM()}
          className="bgm-toggle-button"
        />
      </div>
    </div>
  );
}
