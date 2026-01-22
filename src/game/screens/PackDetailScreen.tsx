import { gameStore } from '../store';
import { Button } from '../../design-system/Button';
import { getPackImagePath } from '../utils/packImages';
import { formatCurrency } from '../../utils/formatCurrency';
import './PackDetailScreen.css';

export function PackDetailScreen() {
  const state = gameStore.getState();
  const pack = state.selectedPack;

  if (!pack) {
    gameStore.navigateTo('home');
    return null;
  }

  const handleBack = () => {
    gameStore.navigateTo('home');
  };

  const handleOpenPack = () => {
    if (state.usdcBalance < pack.price) {
      alert('Insufficient USDC balance!');
      return;
    }
    gameStore.navigateTo('opening');
    // Open pack after a brief delay to show opening animation
    setTimeout(() => {
      const seed = Date.now();
      gameStore.openPack(pack.id, seed);
      gameStore.navigateTo('cardBack');
    }, 2000);
  };

  const packImagePath = getPackImagePath(pack);

  return (
    <div className="pack-detail-screen">
      <div className="detail-header">
        <Button
          variant="secondary"
          size="medium"
          onClick={handleBack}
        >
          ← Back
        </Button>
      </div>

      <main className="detail-main">
        <div className="pack-detail-layout">
          {/* Preview Section */}
          <div className="pack-preview-section">
            <div className="pack-preview-bg">
              <img 
                src={packImagePath}
                alt={pack.name}
                className="pack-preview-image"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  if (target.nextElementSibling) {
                    (target.nextElementSibling as HTMLElement).style.display = 'flex';
                  }
                }}
              />
              <div className="pack-preview-fallback" style={{ display: 'none' }}>
                <div className="pack-fallback-icon">📦</div>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="pack-info-section">
            <h1 className="pack-detail-name">{pack.name}</h1>
            
            <div className="pack-price-section">
              <span className="pack-price-large">${formatCurrency(pack.price)}</span>
            </div>

            <Button
              variant="primary"
              size="large"
              onClick={handleOpenPack}
              disabled={state.usdcBalance < pack.price}
              className="pack-open-button"
            >
              Open Pack
            </Button>

            {state.usdcBalance < pack.price && (
              <p className="insufficient-credits">
                You need ${formatCurrency(pack.price - state.usdcBalance)} more USDC
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
