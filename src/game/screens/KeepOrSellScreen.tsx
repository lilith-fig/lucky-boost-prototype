import { gameStore } from '../store';
import { Button } from '../../design-system/Button';
import { formatCurrency } from '../../utils/formatCurrency';
import './KeepOrSellScreen.css';

export function KeepOrSellScreen() {
  const state = gameStore.getState();
  const result = state.lastResult;

  if (!result) {
    gameStore.navigateTo('home');
    return null;
  }

  const handleKeep = () => {
    gameStore.keepCard();
  };

  const handleSell = () => {
    gameStore.sellCard();
  };

  return (
    <div className="keep-or-sell-screen">
      <div className="choice-container">
        <div className="choice-header">
          <h2>What would you like to do?</h2>
          <div className="card-preview">
            <div className="preview-card">
              <div className="preview-icon">🃏</div>
              <div className="preview-name">{result.card.name}</div>
              <div className="preview-value">${formatCurrency(result.card.value)}</div>
            </div>
          </div>
        </div>

        <div className="choice-actions">
          <Button
            variant="secondary"
            size="large"
            onClick={handleKeep}
          >
            Keep
          </Button>
          <Button
            variant="primary"
            size="large"
            onClick={handleSell}
          >
            Sell for ${formatCurrency(result.card.value)}
          </Button>
        </div>
      </div>
    </div>
  );
}
