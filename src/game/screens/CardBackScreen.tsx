import { useState } from 'react';
import { gameStore } from '../store';
import './CardBackScreen.css';

export function CardBackScreen() {
  const [isFlipping, setIsFlipping] = useState(false);

  const handleCardClick = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    // After flip animation, reveal card
    setTimeout(() => {
      gameStore.navigateTo('cardReveal');
    }, 600);
  };

  return (
    <div className="card-back-screen">
      <div className="card-container">
        <div 
          className={`card-back ${isFlipping ? 'flipping' : ''}`}
          onClick={handleCardClick}
        >
          <div className="card-back-inner">
            <div className="card-back-pattern"></div>
            <p className="card-back-hint">Tap to reveal</p>
          </div>
        </div>
      </div>
    </div>
  );
}
