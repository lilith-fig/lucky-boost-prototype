import { useState, useEffect, useRef } from 'react';
import { gameStore } from '../game/store';
import { CreditIcon } from './CreditIcon';
import { CountUpNumber } from './CountUpNumber';
import './CreditsToast.css';

export function CreditsToast() {
  // Initialize state and ensure toast state is cleared
  const initialState = gameStore.getState();
  // Defensive: Clear invalid toast state on mount - be very aggressive
  if (initialState.showCreditsDropdown) {
    const isValid = initialState.creditsStartBalance !== undefined &&
                   typeof initialState.creditsStartBalance === 'number' &&
                   initialState.credits > initialState.creditsStartBalance &&
                   (initialState.credits - initialState.creditsStartBalance) >= 0.01 &&
                   !(initialState.credits === 0 && initialState.creditsStartBalance === 0);
    
    if (!isValid) {
      // Force clear invalid state immediately
      gameStore.clearCreditsDropdown();
    }
  }
  
  const [state, setState] = useState(gameStore.getState());
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousShowFlagRef = useRef<boolean>(false);

  useEffect(() => {
    const unsubscribe = gameStore.subscribe(() => {
      const newState = gameStore.getState();

      // CRITICAL: Always validate and clear invalid state immediately
      // If showCreditsDropdown is true but credits didn't actually increase, clear it
      if (newState.showCreditsDropdown === true) {
        const isValid = newState.creditsStartBalance !== undefined &&
                       typeof newState.creditsStartBalance === 'number' &&
                       newState.credits > newState.creditsStartBalance &&
                       (newState.credits - newState.creditsStartBalance) >= 0.01;
        
        if (!isValid) {
          // Invalid state detected - clear it immediately
          gameStore.clearCreditsDropdown();
          setState(gameStore.getState());
          if (isVisible) {
            setIsVisible(false);
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
            }
          }
          previousShowFlagRef.current = false;
          return; // Don't process further
        }
      }

      // Only show toast if ALL conditions are met:
      // 1. showCreditsDropdown is explicitly true (set when user clicks "Claim")
      // 2. creditsStartBalance is defined and is a valid number
      // 3. Credits actually increased (credits > creditsStartBalance) - CRITICAL: prevents "0 → 0"
      // 4. The flag just changed from false to true (explicit trigger, not stale state)
      // 5. Credits increased by at least 0.01 (prevent showing when values are effectively the same)
      const creditsIncreased = newState.creditsStartBalance !== undefined &&
                               typeof newState.creditsStartBalance === 'number' &&
                               newState.credits > newState.creditsStartBalance &&
                               (newState.credits - newState.creditsStartBalance) >= 0.01;
      
      const shouldShow = newState.showCreditsDropdown === true && 
                        creditsIncreased &&
                        previousShowFlagRef.current === false; // Only show on transition from false to true

      // Update the previous flag reference
      previousShowFlagRef.current = newState.showCreditsDropdown === true;

      if (shouldShow && !isVisible) {
        // Only show if we're not already visible (prevent re-triggering)
        setIsVisible(true);
        setState(newState);

        // Calculate duration: 800ms for count-up + 500ms to stay = 1300ms total
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          setIsVisible(false);
          gameStore.clearCreditsDropdown();
          previousShowFlagRef.current = false;
        }, 1300);
      } else if (!shouldShow && isVisible) {
        // If conditions are no longer met, hide immediately
        setIsVisible(false);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }
      
      // Always update state to stay in sync
      setState(newState);
    });

    // Initialize the previous flag
    previousShowFlagRef.current = gameStore.getState().showCreditsDropdown === true;

    return () => {
      unsubscribe();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isVisible]);

  // ABSOLUTE GUARD: Check current store state (not component state) to prevent stale renders
  // This is the final safety check to prevent "0 → 0" or any invalid displays
  const currentStoreState = gameStore.getState();
  const creditsIncreased = currentStoreState.creditsStartBalance !== undefined &&
                          typeof currentStoreState.creditsStartBalance === 'number' &&
                          currentStoreState.credits > currentStoreState.creditsStartBalance &&
                          (currentStoreState.credits - currentStoreState.creditsStartBalance) >= 0.01 &&
                          !(currentStoreState.credits === 0 && currentStoreState.creditsStartBalance === 0);

  // Don't render if:
  // 1. Not visible
  // 2. Flag is not set in current store state
  // 3. Start balance is undefined or invalid
  // 4. Credits didn't actually increase (prevent showing "0 → 0" or stale values)
  // 5. Credits are both 0 (prevent "0 → 0" display)
  // Use currentStoreState to ensure we're checking the latest state, not stale component state
  if (!isVisible || 
      !currentStoreState.showCreditsDropdown || 
      !creditsIncreased ||
      currentStoreState.creditsStartBalance === undefined ||
      typeof currentStoreState.creditsStartBalance !== 'number' ||
      currentStoreState.credits <= currentStoreState.creditsStartBalance) {
    // If state is invalid, clear it
    if (currentStoreState.showCreditsDropdown && !creditsIncreased) {
      gameStore.clearCreditsDropdown();
    }
    return null;
  }

  return (
    <div className="credits-toast">
      <div className="credits-toast-item">
        <div className="credits-toast-item-left">
          <CreditIcon size={14} className="credits-toast-icon" />
          <div className="credits-toast-label">Credits</div>
        </div>
        <div className="credits-toast-value">
          <CountUpNumberWithStart 
            key={`${state.creditsStartBalance}-${state.credits}`}
            startValue={state.creditsStartBalance}
            endValue={state.credits} 
            duration={800}
          />
        </div>
      </div>
    </div>
  );
}

// Custom component that counts from start to end
function CountUpNumberWithStart({ 
  startValue, 
  endValue, 
  duration 
}: { 
  startValue: number; 
  endValue: number; 
  duration: number;
}) {
  const [displayValue, setDisplayValue] = useState(startValue);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    // Cancel any ongoing animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (startValue === endValue) {
      setDisplayValue(endValue);
      isAnimatingRef.current = false;
      return;
    }

    // Reset to start value and begin animation
    setDisplayValue(startValue);
    isAnimatingRef.current = true;
    startTimeRef.current = Date.now();

    const animate = () => {
      if (!startTimeRef.current) return;
      
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (endValue - startValue) * eased;
      
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(endValue);
        isAnimatingRef.current = false;
        animationFrameRef.current = null;
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      isAnimatingRef.current = false;
    };
  }, [startValue, endValue, duration]);

  const formattedValue = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(displayValue);

  return <span>${formattedValue}</span>;
}

