import { useEffect } from 'react';
import api from '../utilities/api';

const EXPIRATION_TIME = 3 * 60 * 1000; // 3 minutes

const AccessTokenManager = ({ userLoggedIn, children }) => {
  useEffect(
    () => {
      if (userLoggedIn) {
        const nowPlus3Minutes = new Date(Date.now() + EXPIRATION_TIME);
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
          const newExpiration = new Date(Date.now() + EXPIRATION_TIME);
          localStorage.setItem(
            'sessionExpirationARP',
            newExpiration.toISOString(),
          );
        }
      }, EXPIRATION_TIME);

      return () => {
        clearInterval(intervalId);
      };
    },
    [userLoggedIn],
  );

  return children;
};

export default AccessTokenManager;
