import './PackOpeningScreen.css';

export function PackOpeningScreen() {
  return (
    <div className="pack-opening-screen">
      <div className="opening-animation">
        <div className="pack-shake">
          <div className="pack-icon-animated">📦</div>
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
