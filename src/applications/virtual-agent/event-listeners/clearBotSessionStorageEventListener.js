import { clearBotSessionStorage } from '../utils/sessionStorage';

export default function clearBotSessionStorageEventListener(isLoggedIn) {
  const handler = () => {
    clearBotSessionStorage(false, isLoggedIn);
  };

  window.addEventListener('beforeunload', handler);

  // Return cleanup remover for React effects
  return () => window.removeEventListener('beforeunload', handler);
}
