import { gameStore } from '../game/store';
import './Logo.css';

export function Logo() {
  const handleLogoClick = () => {
    gameStore.navigateTo('home');
  };

  return (
    <div className="app-logo" onClick={handleLogoClick}>
      <img 
        src="/logo.png" 
        alt="GACHA" 
        className="logo-image"
        onError={(e) => {
          // Fallback if image doesn't exist
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          if (target.nextElementSibling) {
            (target.nextElementSibling as HTMLElement).style.display = 'block';
          }
        }}
      />
      <div className="logo-fallback" style={{ display: 'none' }}>
        <span className="logo-text">GACHA</span>
      </div>
    </div>
  );
}
