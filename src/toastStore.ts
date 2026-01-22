let message: string | null = null;
const listeners = new Set<() => void>();

export const toastStore = {
  getState: () => ({ toastMessage: message }),
  showToast: (m: string) => {
    message = m;
    listeners.forEach((l) => l());
  },
  clearToast: () => {
    message = null;
    listeners.forEach((l) => l());
  },
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
