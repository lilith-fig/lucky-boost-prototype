import { useState, useRef } from 'react';
import { gameStore } from '../store';
import './CardBackScreen.css';

export function CardBackScreen() {
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});
  const [glossStyle, setGlossStyle] = useState<React.CSSProperties>({});
  const cardRef = useRef<HTMLImageElement>(null);
  const state = gameStore.getState();
  const theme = state.selectedPack?.theme ?? 'pokemon';

  const handleCardClick = () => {
    // Navigate directly to card reveal (card-reveal.mp3 will play in CardRevealScreen)
    gameStore.navigateTo('cardReveal');
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    // NOTE: No SFX should be played during hover/tilt interactions
    // This handler only handles visual tilt and gloss effects

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
    
    // Calculate gloss angle based on tilt - mimics light reflection
    const glossAngle = 160 + (tiltY * 0.5) + (tiltX * 0.3);
    const glossX = 50 + (mouseX * 30);
    const glossY = 50 + (mouseY * 30);
    setGlossStyle({
      background: `linear-gradient(${glossAngle}deg, rgba(217, 217, 217, 0.00) -0.53%, #F5FFE7 7.78%, rgba(217, 217, 217, 0.00) 23.15%, #D8F6FF 31.74%, rgba(231, 231, 231, 0.00) 42.74%, rgba(217, 217, 217, 0.00) 75.98%, #E8E5FF 81.55%, rgba(217, 217, 217, 0.00) 87.33%, rgba(252, 236, 255, 0.90) 91.46%, #D9D9D9 96.63%)`,
      backgroundSize: '150% 150%',
      backgroundPosition: `${glossX}% ${glossY}%`,
    });
  };

  const handleMouseLeave = () => {
    // NOTE: No SFX should be played during hover/tilt interactions
    // This handler only resets visual tilt and gloss effects
    
    // Reset tilt when mouse leaves
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
    });
    setGlossStyle({
      background: `linear-gradient(160deg, rgba(217, 217, 217, 0.00) -0.53%, #F5FFE7 7.78%, rgba(217, 217, 217, 0.00) 23.15%, #D8F6FF 31.74%, rgba(231, 231, 231, 0.00) 42.74%, rgba(217, 217, 217, 0.00) 75.98%, #E8E5FF 81.55%, rgba(217, 217, 217, 0.00) 87.33%, rgba(252, 236, 255, 0.90) 91.46%, #D9D9D9 96.63%)`,
      backgroundSize: '150% 150%',
      backgroundPosition: '50% 50%',
    });
  };

  // Corrected to match the types: '"pokemon" | "onepiece"'
  const cardBackImage = theme === 'onepiece' ? '/card-back-op.png' : '/card-back-pkm.png';

  return (
    <div className="card-back-screen">
      <div className="card-container">
        <div 
          className="card-back-image-wrapper"
          style={tiltStyle}
          onClick={handleCardClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <img 
            ref={cardRef}
            src={cardBackImage} 
            alt="Card back" 
            className="card-back-image"
          />
          <div 
            className="card-gloss-layer"
            style={glossStyle}
          />
        </div>
        <p className="card-back-hint">Tap to reveal</p>
      </div>
    </div>
  );
}
