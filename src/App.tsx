import { useEffect, useState } from 'react';
import { gameStore } from './game/store';
import { AppLayout } from './components/AppLayout';
import { Header } from './components/Header';
import { HomeScreen } from './game/screens/HomeScreen';
import { MarketplaceScreen } from './game/screens/MarketplaceScreen';
import { PackDetailScreen } from './game/screens/PackDetailScreen';
import { PackOpeningScreen } from './game/screens/PackOpeningScreen';
import { CardBackScreen } from './game/screens/CardBackScreen';
import { CardRevealScreen } from './game/screens/CardRevealScreen';
import { RewardPopup } from './game/screens/RewardPopup';
import { Toast } from './design-system/Toast';
import { CreditsToast } from './components/CreditsToast';
import { AudioManager } from './components/AudioManager';
import type { Screen } from './game/types';
import './App.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('marketplace');
  const [gameState, setGameState] = useState(gameStore.getState());

  useEffect(() => {
    // Subscribe to store changes
    const unsubscribe = gameStore.subscribe(() => {
      const state = gameStore.getState();
      setGameState(state);
      setCurrentScreen(state.currentScreen);
    });

    // Initialize screen from store
    const initialState = gameStore.getState();
    setCurrentScreen(initialState.currentScreen);
    setGameState(initialState);

    return unsubscribe;
  }, []);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen />;
      case 'marketplace':
        return <MarketplaceScreen />;
      case 'packDetail':
        return <PackDetailScreen />;
      case 'opening':
        return <PackOpeningScreen />;
      case 'cardBack':
        return <CardBackScreen />;
      case 'cardReveal':
        return <CardRevealScreen />;
      default:
        return <MarketplaceScreen />;
    }
  };

  return (
    <AppLayout>
      <AudioManager />
      <Header />
      <main className="app-main-content">
        {renderScreen()}
      </main>
      {gameState.showRewardPopup && !gameState.rewardClaimed && <RewardPopup />}
      <Toast />
      <CreditsToast />
    </AppLayout>
  );
}

export default App;
