import * as Sentry from '@sentry/browser';
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

  Sentry.captureException(
    new TypeError('Virtual Agent chatbot could not find sign out link in menu'),
  );
}
