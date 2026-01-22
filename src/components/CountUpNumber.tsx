import { useEffect, useState, useRef } from 'react';
import { formatCurrency } from '../utils/formatCurrency';

interface CountUpNumberProps {
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export function CountUpNumber({ 
  value, 
  duration = 1000, 
  className = '',
  prefix = '',
  suffix = '',
  decimals = 2
}: CountUpNumberProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const previousValueRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const isFirstRenderRef = useRef(true);

  useEffect(() => {
    // On first render, animate from 0 to the target value
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      const startValue = 0;
      const endValue = value;
      const difference = endValue - startValue;
      
      if (Math.abs(difference) < 0.01) {
        setDisplayValue(endValue);
        previousValueRef.current = endValue;
        return;
      }

      setIsAnimating(true);
      startTimeRef.current = Date.now();

      const animate = () => {
        const elapsed = Date.now() - (startTimeRef.current || 0);
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease-out cubic for smooth deceleration
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentValue = startValue + (difference * eased);
        
        setDisplayValue(currentValue);

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          setDisplayValue(endValue);
          previousValueRef.current = endValue;
          setIsAnimating(false);
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }

    // Only animate if value changed
    if (value === previousValueRef.current) {
      return;
    }

    const startValue = previousValueRef.current ?? 0;
    const endValue = value;
    const difference = endValue - startValue;

    // If difference is 0 or very small, just set the value
    if (Math.abs(difference) < 0.01) {
      setDisplayValue(endValue);
      previousValueRef.current = endValue;
      return;
    }

    setIsAnimating(true);
    startTimeRef.current = Date.now();

    const animate = () => {
      const elapsed = Date.now() - (startTimeRef.current || 0);
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (difference * eased);
      
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Ensure final value is exact
        setDisplayValue(endValue);
        previousValueRef.current = endValue;
        setIsAnimating(false);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [value, duration]);

  // Format the display value
  const formattedValue = formatCurrency(displayValue);

  return (
    <span className={className}>
      {prefix}{formattedValue}{suffix}
    </span>
  );
}
