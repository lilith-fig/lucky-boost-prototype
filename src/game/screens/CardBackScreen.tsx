import { useState, useRef } from 'react';
import { gameStore } from '../store';
import { useAudio } from '../../audio/useAudio';
import { Button } from '../../design-system/Button';
import './CardBackScreen.css';

export function CardBackScreen() {
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});
  const [glossStyle, setGlossStyle] = useState<React.CSSProperties>({});
  const cardRef = useRef<HTMLImageElement>(null);
  const state = gameStore.getState();
  const theme = state.selectedPack?.theme ?? 'pokemon';
  const audio = useAudio();

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

      {/* BGM Toggle Button */}
      <div className="card-back-bgm-toggle">
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
