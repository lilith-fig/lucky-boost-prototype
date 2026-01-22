import { useEffect, useState } from 'react';
import { gameStore } from './game/store';
import { Header } from './components/Header';
import { HomeScreen } from './game/screens/HomeScreen';
import { PackDetailScreen } from './game/screens/PackDetailScreen';
import { PackOpeningScreen } from './game/screens/PackOpeningScreen';
import { CardBackScreen } from './game/screens/CardBackScreen';
import { CardRevealScreen } from './game/screens/CardRevealScreen';
import { RewardPopup } from './game/screens/RewardPopup';
import type { Screen } from './game/types';
import './App.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
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
      case 'packDetail':
        return <PackDetailScreen />;
      case 'opening':
        return <PackOpeningScreen />;
      case 'cardBack':
        return <CardBackScreen />;
      case 'cardReveal':
        return <CardRevealScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="app">
      <Header />
      {renderScreen()}
      {gameState.showRewardPopup && <RewardPopup />}
    </div>
  );
}

export default App;
