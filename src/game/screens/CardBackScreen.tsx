import { useState, useRef } from 'react';
import { gameStore } from '../store';
import './CardBackScreen.css';

export function CardBackScreen() {
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});
  const cardRef = useRef<HTMLImageElement>(null);
  const state = gameStore.getState();
  const theme = state.selectedPack?.theme ?? 'pokemon';

  const handleCardClick = () => {
    // Navigate directly to card reveal
    gameStore.navigateTo('cardReveal');
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate mouse position relative to card center (-1 to 1)
    const mouseX = (e.clientX - centerX) / (rect.width / 2);
    const mouseY = (e.clientY - centerY) / (rect.height / 2);
    
    // Calculate tilt (max 15 degrees)
    const tiltX = mouseY * 15; // Tilt on X axis based on Y mouse position
    const tiltY = mouseX * -15; // Tilt on Y axis based on X mouse position
    
    // Apply smooth tilt transform
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
    });
  };

  const handleMouseLeave = () => {
    // Reset tilt when mouse leaves
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
    });
  };

  // Corrected to match the types: '"pokemon" | "onepiece"'
  const cardBackImage = theme === 'onepiece' ? '/card-back-op.png' : '/card-back-pkm.png';

  return (
    <div className="card-back-screen">
      <div className="card-container">
        <img 
          ref={cardRef}
          src={cardBackImage} 
          alt="Card back" 
          className="card-back-image"
          style={tiltStyle}
          onClick={handleCardClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />
        <p className="card-back-hint">Tap to reveal</p>
      </div>
    </div>
  );
}
