import { logErrorToDatadog } from '../utils/logging';
import { clearBotSessionStorage } from '../utils/sessionStorage';

export default function signOutEventListener() {
  const links = document.querySelectorAll('div#account-menu ul li a');
  for (const link of links) {
    if (link.textContent === 'Sign Out') {
      link.addEventListener('click', () => {
        clearBotSessionStorage(true);
      });
      return;
    }
  }

  const error = new TypeError(
    'Virtual Agent chatbot could not find sign out link in menu',
  );
  logErrorToDatadog(true, error.message, error);
}
