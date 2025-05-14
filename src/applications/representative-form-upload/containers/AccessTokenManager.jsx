import { useEffect } from 'react';
import api from '../utilities/api';

const AccessTokenManager = ({ userLoggedIn }) => {
  useEffect(
    () => {
      if (userLoggedIn) {
        const nowPlus3Minutes = new Date(Date.now() + 3 * 60 * 1000);
        localStorage.setItem(
          'sessionExpirationARP',
          nowPlus3Minutes.toISOString(),
        );
      }

      const intervalId = setInterval(() => {
        const sessionExpiration = localStorage.getItem('sessionExpirationARP');
        if (sessionExpiration && new Date() > new Date(sessionExpiration)) {
          console.log('Session expired. Fetching new access token...'); // eslint-disable-line no-console
          api.getUser();
          const newExpiration = new Date(Date.now() + 3 * 60 * 1000);
          localStorage.setItem(
            'sessionExpirationARP',
            newExpiration.toISOString(),
          );
        }
      }, 3 * 60 * 1000);

      return () => {
        clearInterval(intervalId);
      };
    },
    [userLoggedIn],
  );

  return null;
};

export default AccessTokenManager;
