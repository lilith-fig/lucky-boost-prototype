import { useState } from 'react';
import { gameStore } from '../store';
import { Button } from '../../design-system/Button';
import { getPackImagePath } from '../utils/packImages';
import { getRandomCardImageUrl } from '../utils/cardImages';
import { formatCurrency } from '../../utils/formatCurrency';
import { PokeballIcon } from '../../components/PokeballIcon';
import { useSFX } from '../../audio/useAudio';
import './PackDetailScreen.css';

function LatestDropCard({ card, packTheme, imageUrl }: { card?: any; packTheme: string; imageUrl?: string }) {
  return (
    <div className="latest-drop-card">
      {imageUrl ? (
        <div className="latest-drop-image-wrapper">
          <img 
            src={imageUrl} 
            alt={card?.name || 'Card'}
            className="latest-drop-image"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          <img 
            src={imageUrl} 
            alt=""
            className="latest-drop-image-reflection"
            aria-hidden="true"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      ) : (
        <div className="latest-drop-placeholder">
          <img 
            src={getRandomCardImageUrl(packTheme as any)} 
            alt="Card placeholder"
            className="latest-drop-image"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          <img 
            src={getRandomCardImageUrl(packTheme as any)} 
            alt=""
            className="latest-drop-image-reflection"
            aria-hidden="true"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      )}
    </div>
  );
}

export function PackDetailScreen() {
  const state = gameStore.getState();
  const pack = state.selectedPack;
  const [showOdds, setShowOdds] = useState(false);
  const sfx = useSFX();

  if (!pack) {
    gameStore.navigateTo('home');
    return null;
  }

  const handleBack = () => {
    sfx.play('navigation');
    gameStore.navigateTo('home');
  };

  const handleOpenPack = () => {
    if (state.usdcBalance < pack.price) {
      sfx.play('error');
      alert('Insufficient USDC balance!');
      return;
    }
    sfx.play('buttonClick');
    gameStore.navigateTo('opening');
    // Open pack after opening animation (2s shake) finishes
    setTimeout(() => {
      const seed = Date.now();
      gameStore.openPack(pack.id, seed);
      gameStore.navigateTo('cardBack');
    }, 2000);
  };

  const packImagePath = getPackImagePath(pack);

  const rarityLabels: Record<string, string> = {
    common: 'Common',
    rare: 'Rare',
    epic: 'Epic',
    legendary: 'Legendary',
    mythic: 'Mythic',
  };

  return (
    <div className="pack-detail-screen">
      <main className="detail-main">
        <div className="pack-detail-layout">
          {/* Preview Section Group */}
          <div className="pack-preview-group">
            {/* Preview Section */}
            <div className="pack-preview-section">
              <div className="pack-preview-bg">
                <Button
                  variant="secondary"
                  size="medium"
                  onClick={handleBack}
                >
                  ← Back
                </Button>
                <div className="pack-preview-image-wrapper">
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
                  <img 
                    src={packImagePath}
                    alt=""
                    className="pack-preview-image-reflection"
                    aria-hidden="true"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
                <div className="pack-preview-fallback" style={{ display: 'none' }}>
                  <div className="pack-fallback-icon">📦</div>
                </div>
              </div>
            </div>

            {/* Latest Drops Section */}
            <div className="latest-drops-section">
              <h2 className="latest-drops-title">
                <PokeballIcon size={16} className="latest-drops-icon" />
                Latest Drops
              </h2>
              <div className="latest-drops-grid">
                {state.inventory.length > 0 ? (
                  state.inventory
                    .slice(-6)
                    .reverse()
                    .map((card) => (
                      <LatestDropCard 
                        key={card.id} 
                        card={card}
                        packTheme={pack.theme}
                        imageUrl={card.imageUrl}
                      />
                    ))
                ) : (
                  <div className="latest-drops-empty">
                    <p>No cards yet. Open a pack to see your drops here!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="pack-info-section">
            <div className="pack-info-group">
              <div className="pack-divider"></div>

              <h1 className="pack-detail-name">{pack.name}</h1>

              <p className="pack-description">
                {pack.description || "Open a pack to reveal one graded Pokémon card that can be shipped to you, or sell it back for 95% of its fair market value if you don't like it."}
              </p>

              <div className="pack-info-details">
                <div className="pack-info-item">
                  <span className="pack-info-label">Cards per pack</span>
                  <span className="pack-info-value">1</span>
                </div>
              </div>

              <div className="pack-divider"></div>

              {/* Odds Section */}
              <div className="pack-odds-section">
                <div className="pack-odds-header-wrapper">
                  <span className="pack-odds-title">Odds</span>
                  <Button
                    variant="secondary"
                    size="medium"
                    onClick={() => setShowOdds(!showOdds)}
                    className="pack-odds-toggle"
                    iconOnly={true}
                    iconLeft={
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 2C4.5 2 1.73 4.11 0 7.5C1.73 10.89 4.5 13 8 13C11.5 13 14.27 10.89 16 7.5C14.27 4.11 11.5 2 8 2ZM8 11.5C6.07 11.5 4.5 9.93 4.5 8C4.5 6.07 6.07 4.5 8 4.5C9.93 4.5 11.5 6.07 11.5 8C11.5 9.93 9.93 11.5 8 11.5ZM8 6C6.9 6 6 6.9 6 8C6 9.1 6.9 10 8 10C9.1 10 10 9.1 10 8C10 6.9 9.1 6 8 6Z" fill="currentColor"/>
                      </svg>
                    }
                  />
                </div>

                {showOdds && (
                  <div className="pack-odds-list">
                    {pack.odds.map((odd, index) => (
                      <div key={index} className="pack-odds-item">
                        <div className="pack-odds-header">
                          <span className="pack-odds-rarity">{rarityLabels[odd.rarity]}</span>
                          <span className="pack-odds-probability">{(odd.probability * 100).toFixed(1)}%</span>
                        </div>
                        <div className="pack-odds-range">
                          ${formatCurrency(odd.minValue)} - ${formatCurrency(odd.maxValue)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <Button
              variant="primary"
              size="large"
              onClick={handleOpenPack}
              disabled={state.usdcBalance < pack.price}
              className="pack-open-button"
              iconLeft={
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M9.162 1.16618C9.1643 0.524492 8.64603 0.00240778 8.00434 8.29488e-06C7.36266 -0.00239133 6.84049 0.516155 6.838 1.15784C6.83033 3.29435 6.27216 4.6392 5.41312 5.46896C4.54452 6.30794 3.17369 6.80931 1.14552 6.8381C0.507038 6.84717 -0.00450257 7.36972 2.9888e-05 8.00825C0.00456234 8.64677 0.523469 9.16201 1.16201 9.16201C3.41493 9.16201 4.75315 9.75712 5.55245 10.6215C6.36956 11.5051 6.82036 12.8805 6.83803 14.8484C6.84368 15.4768 7.34784 15.9868 7.97609 15.9998C8.60435 16.0127 9.12906 15.5238 9.16055 14.8962C9.26488 12.8166 9.81775 11.4208 10.6764 10.5454C11.5208 9.68454 12.8312 9.15442 14.8336 9.162C15.4714 9.16441 15.9919 8.65234 15.9999 8.01462C16.0079 7.3769 15.5005 6.85189 14.8628 6.83825C12.6658 6.79125 11.2956 6.21032 10.4651 5.34778C9.63208 4.48262 9.15433 3.13902 9.162 1.16618Z" fill="currentColor"/>
                </svg>
              }
              iconRight={true}
            >
              Open Pack · ${formatCurrency(pack.price)}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
