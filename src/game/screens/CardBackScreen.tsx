import { useState } from 'react';
import { gameStore } from '../store';
import './CardBackScreen.css';

export function CardBackScreen() {
  const [isFlipping, setIsFlipping] = useState(false);
  const state = gameStore.getState();
  const theme = state.selectedPack?.theme ?? 'pokemon';

  const handleCardClick = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    // After flip animation, reveal card
    setTimeout(() => {
      gameStore.navigateTo('cardReveal');
    }, 600);
  };


  const cardBackImage = theme === 'onepiece' ? '/card-back-op.png' : '/card-back-pkm.png';

  return (
    <div className="card-back-screen">
      <div className="card-container">
        <img 
          src={cardBackImage} 
          alt="Card back" 
          className={`card-back-image ${isFlipping ? 'flipping' : ''}`}
          onClick={handleCardClick}
        />
        <p className="card-back-hint">Tap to reveal</p>
      </div>
    </div>
  );
}
