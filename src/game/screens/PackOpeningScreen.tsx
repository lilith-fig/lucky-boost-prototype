import { useState, useEffect } from 'react';
import { gameStore } from '../store';
import { getPackImagePath } from '../utils/packImages';
import { useSFX } from '../../audio/useAudio';
import './PackOpeningScreen.css';

export function PackOpeningScreen() {
  const state = gameStore.getState();
  const pack = state.selectedPack;
  const packImagePath = pack ? getPackImagePath(pack) : null;
  const [dots, setDots] = useState('.');
  const sfx = useSFX();

  useEffect(() => {
    // Play pack opening sound
    sfx.play('packOpen');

    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === '.') return '..';
        if (prev === '..') return '...';
        return '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, [sfx]);

  return (
    <div className="pack-opening-screen">
      <div className="opening-animation">
        <div className="pack-shake">
          <div className="pack-icon-animated">
            {packImagePath ? (
              <img 
                src={packImagePath} 
                alt={pack?.name || 'Pack'} 
                className="pack-image"
              />
            ) : (
              <span className="pack-fallback">📦</span>
            )}
          </div>
        </div>
        <p className="opening-text">
          Opening Pack<span className="opening-dots">{dots}</span>
        </p>
      </div>
    </div>
  );
}
