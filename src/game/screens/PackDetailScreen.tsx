import { useState, useMemo } from 'react';
import { gameStore } from '../store';
import { Button } from '../../design-system/Button';
import { getPackImagePath } from '../utils/packImages';
import { getCardImageList } from '../utils/cardImages';
import { formatCurrency } from '../../utils/formatCurrency';
import { PokeballIcon } from '../../components/PokeballIcon';
import { useSFX, useAudio } from '../../audio/useAudio';
import './PackDetailScreen.css';

function LatestDropCard({ card, packTheme, imageUrl }: { card?: any; packTheme: string; imageUrl?: string }) {
  // Memoize placeholder image URL based on card ID to prevent it from changing on re-renders
  const placeholderImageUrl = useMemo(() => {
    if (imageUrl) return null; // Don't generate if we have an imageUrl
    
    // Use card ID as a seed to get a consistent random image
    const cardId = card?.id || '';
    const imageList = getCardImageList(packTheme as any);
    if (imageList.length === 0) return '';
    
    // Simple hash of card ID to get consistent index
    let hash = 0;
    for (let i = 0; i < cardId.length; i++) {
      hash = ((hash << 5) - hash) + cardId.charCodeAt(i);
      hash = hash & hash; // Convert to 32-bit integer
    }
    const index = Math.abs(hash) % imageList.length;
    return imageList[index];
  }, [card?.id, packTheme, imageUrl]);

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
            src={placeholderImageUrl || ''} 
            alt="Card placeholder"
            className="latest-drop-image"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          <img 
            src={placeholderImageUrl || ''} 
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
  const audio = useAudio();

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
                <div className="pack-preview-header">
                  <Button
                    variant="secondary"
                    size="medium"
                    onClick={handleBack}
                  >
                    ← Back
                  </Button>
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
              <h1 className="pack-detail-name">{pack.name}</h1>

              <div className="pack-divider"></div>

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
                    disabled
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
