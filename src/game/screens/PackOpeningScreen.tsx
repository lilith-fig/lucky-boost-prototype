import { gameStore } from '../store';
import { getPackImagePath } from '../utils/packImages';
import './PackOpeningScreen.css';

export function PackOpeningScreen() {
  const state = gameStore.getState();
  const pack = state.selectedPack;
  const packImagePath = pack ? getPackImagePath(pack) : null;

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
        <p className="opening-text">Opening Pack...</p>
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}
