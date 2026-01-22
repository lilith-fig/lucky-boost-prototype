import { useEffect, useState } from 'react';
import { toastStore } from '../toastStore';
import './Toast.css';

const TOAST_DURATION_MS = 2000;

export function Toast() {
  const [message, setMessage] = useState<string | null>(() => toastStore.getState().toastMessage);

  useEffect(() => {
    const unsubscribe = toastStore.subscribe(() => {
      setMessage(toastStore.getState().toastMessage);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!message) return;
    const id = setTimeout(() => {
      toastStore.clearToast();
    }, TOAST_DURATION_MS);
    return () => clearTimeout(id);
  }, [message]);

  if (!message) return null;

  return (
    <div className="toast" role="status" aria-live="polite">
      {message}
    </div>
  );
}
