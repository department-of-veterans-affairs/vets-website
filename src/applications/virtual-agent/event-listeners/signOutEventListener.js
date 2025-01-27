import * as Sentry from '@sentry/browser';
import { clearBotSessionStorage } from '../utils/sessionStorage';
import { logErrorToDatadog } from '../utils/logging';

export default function signOutEventListener(isDatadogLoggingEnabled) {
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
  Sentry.captureException(error);
  logErrorToDatadog(isDatadogLoggingEnabled, error.message, error);
}
