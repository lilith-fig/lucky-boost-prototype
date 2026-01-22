import { useState, useEffect } from 'react';
import { luckyBoostStore } from './store';

export function useLuckyBoost() {
  const [state, setState] = useState(luckyBoostStore.getState());

  useEffect(() => {
    const unsubscribe = luckyBoostStore.subscribe(() => {
      setState(luckyBoostStore.getState());
    });
    return unsubscribe;
  }, []);

  return state;
}
