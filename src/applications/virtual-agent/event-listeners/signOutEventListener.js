import { clearBotSessionStorage } from '../utils/sessionStorage';
import logger from '../utils/logger';

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
  logger.error(error.message, error);
}
