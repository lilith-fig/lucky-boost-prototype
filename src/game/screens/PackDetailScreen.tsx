import { useState } from 'react';
import { gameStore } from '../store';
import { Button } from '../../design-system/Button';
import { getPackImagePath } from '../utils/packImages';
import { getRandomCardImageUrl } from '../utils/cardImages';
import { formatCurrency } from '../../utils/formatCurrency';
import { PokeballIcon } from '../../components/PokeballIcon';
import './PackDetailScreen.css';

export function PackDetailScreen() {
  const state = gameStore.getState();
  const pack = state.selectedPack;
  const [showOdds, setShowOdds] = useState(false);

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
                      <div key={card.id} className="latest-drop-card">
                        {card.imageUrl ? (
                          <div className="latest-drop-image-wrapper">
                            <img 
                              src={card.imageUrl} 
                              alt={card.name}
                              className="latest-drop-image"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                            <img 
                              src={card.imageUrl} 
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
                              src={getRandomCardImageUrl(pack.theme)} 
                              alt="Card placeholder"
                              className="latest-drop-image"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                            <img 
                              src={getRandomCardImageUrl(pack.theme)} 
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
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 0L9.5 5.5L15 7L9.5 8.5L8 14L6.5 8.5L1 7L6.5 5.5L8 0Z" fill="currentColor"/>
                  <path d="M12 2L12.5 4.5L15 5L12.5 5.5L12 8L11.5 5.5L9 5L11.5 4.5L12 2Z" fill="currentColor" opacity="0.8"/>
                  <path d="M4 10L4.5 12.5L7 13L4.5 13.5L4 16L3.5 13.5L1 13L3.5 12.5L4 10Z" fill="currentColor" opacity="0.6"/>
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
