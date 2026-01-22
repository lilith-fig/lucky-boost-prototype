import { PACKS } from '../packs';
import { gameStore } from '../store';
import { getPackImagePath } from '../utils/packImages';
import { formatCurrency } from '../../utils/formatCurrency';
import './HomeScreen.css';

export function HomeScreen() {

  const handlePackClick = (packId: string) => {
    const pack = PACKS.find(p => p.id === packId);
    if (pack) {
      gameStore.selectPack(pack);
      gameStore.navigateTo('packDetail');
    }
  };

  // Sort packs: One-Piece packs first, then Pokemon packs
  const sortedPacks = [...PACKS].sort((a, b) => {
    if (a.theme === 'onepiece' && b.theme !== 'onepiece') return -1;
    if (a.theme !== 'onepiece' && b.theme === 'onepiece') return 1;
    return 0;
  });

  return (
    <div className="home-screen">
      <main className="home-main">
        <div className="packs-grid">
          {sortedPacks.map((pack) => {
            const packImagePath = getPackImagePath(pack);
            const isOnePiece = pack.theme === 'onepiece';
            return (
              <div 
                key={pack.id} 
                className="pack-card"
                onClick={() => handlePackClick(pack.id)}
              >
                {/* Tag Label for One-Piece packs */}
                {isOnePiece && (
                  <div className="pack-tag">NEW</div>
                )}
                
                {/* Preview Section */}
                <div className="pack-preview">
                  <img 
                    src={packImagePath}
                    alt={pack.name}
                    className="pack-image"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      if (target.nextElementSibling) {
                        (target.nextElementSibling as HTMLElement).style.display = 'flex';
                      }
                    }}
                  />
                  <div className="pack-image-fallback" style={{ display: 'none' }}>
                    <div className="pack-fallback-icon">📦</div>
                  </div>
                </div>
                
                {/* Info Section */}
                <div className="pack-info">
                  <h3 className="pack-name">{pack.name}</h3>
                  <p className="pack-price">$ {formatCurrency(pack.price)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
