import { logErrorToDatadog } from '../utils/logging';
import { clearBotSessionStorage } from '../utils/sessionStorage';

export default function signOutEventListener(isLoggedIn) {
  const links = Array.from(
    document.querySelectorAll('div#account-menu ul li a'),
  );

  const handler = () => clearBotSessionStorage(true);
  let attached = false;

  for (const link of links) {
    if (link.textContent === 'Sign Out') {
      link.addEventListener('click', handler);
      attached = true;
    }
  }

  if (!attached && isLoggedIn) {
    const error = new TypeError(
      'Virtual Agent chatbot could not find sign out link in menu, and user is logged in',
    );
    logErrorToDatadog(true, error);
  }

  // Return cleanup that removes listeners if attached
  return () => {
    for (const link of links) {
      if (link.textContent === 'Sign Out') {
        link.removeEventListener('click', handler);
      }
    }
  };
}
