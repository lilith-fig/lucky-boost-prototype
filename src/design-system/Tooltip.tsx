import React, { useState, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import './Tooltip.css';

export interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  persistOnClick?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = 'bottom',
  className = '',
  persistOnClick = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [positionReady, setPositionReady] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Use useLayoutEffect to calculate position BEFORE first paint
  useLayoutEffect(() => {
    if (isVisible && tooltipRef.current && triggerRef.current) {
      const tooltip = tooltipRef.current;
      const trigger = triggerRef.current;
      const rect = trigger.getBoundingClientRect();

      // Calculate and set position synchronously
      // useLayoutEffect runs synchronously before paint, so position is set before first render
      switch (position) {
        case 'top':
          tooltip.style.bottom = `${window.innerHeight - rect.top + 8}px`;
          tooltip.style.left = `${rect.left + rect.width / 2}px`;
          tooltip.style.transform = 'translateX(-50%)';
          break;
        case 'bottom':
          tooltip.style.top = `${rect.bottom + 8}px`;
          tooltip.style.left = `${rect.left + rect.width / 2}px`;
          tooltip.style.transform = 'translateX(-50%)';
          break;
        case 'left':
          tooltip.style.right = `${window.innerWidth - rect.left + 8}px`;
          tooltip.style.top = `${rect.top + rect.height / 2}px`;
          tooltip.style.transform = 'translateY(-50%)';
          break;
        case 'right':
          tooltip.style.left = `${rect.right + 8}px`;
          tooltip.style.top = `${rect.top + rect.height / 2}px`;
          tooltip.style.transform = 'translateY(-50%)';
          break;
      }

      // Mark position as ready immediately after setting position
      setPositionReady(true);
    } else {
      setPositionReady(false);
    }
  }, [isVisible, position]);

  // Handle click outside to close pinned tooltip
  useLayoutEffect(() => {
    if (!isPinned) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        triggerRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsPinned(false);
        setIsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isPinned]);

  const handleTriggerClick = () => {
    if (persistOnClick) {
      if (isPinned) {
        setIsPinned(false);
        setIsVisible(false);
      } else {
        setIsPinned(true);
        setIsVisible(true);
      }
    }
  };

  const handleMouseEnter = () => {
    if (!isPinned) {
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isPinned) {
      setIsVisible(false);
    }
  };

  return (
    <>
      <div
        ref={triggerRef}
        className={`tooltip-trigger ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleTriggerClick}
      >
        {children}
      </div>
      {isVisible && createPortal(
        <div 
          ref={tooltipRef} 
          className={`tooltip tooltip-${position} ${positionReady ? 'tooltip-ready' : 'tooltip-positioning'}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="tooltip-content">
            {content}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
