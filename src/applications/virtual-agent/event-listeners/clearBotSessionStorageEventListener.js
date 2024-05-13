import { clearBotSessionStorage } from '../utils/sessionStorage';

export default function clearBotSessionStorageEventListener(isLoggedIn) {
  window.addEventListener('beforeunload', () => {
    clearBotSessionStorage(false, isLoggedIn);
  });
}
