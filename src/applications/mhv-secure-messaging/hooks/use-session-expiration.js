import { useEffect } from 'react';

export const useSessionExpiration = (beforeUnloadHandler, noTimeout) => {
  useEffect(
    () => {
      const checkSessionExpiration = () => {
        const sessionExpiration = localStorage.getItem('sessionExpiration');
        if (sessionExpiration) {
          const expirationTime = new Date(sessionExpiration);
          const currentTime = new Date();

          if (currentTime >= expirationTime) {
            window.removeEventListener('beforeunload', beforeUnloadHandler);
            return;
          }
        }
        window.addEventListener('beforeunload', beforeUnloadHandler);
      };

      checkSessionExpiration();

      // Timer to check session expiration periodically
      const interval = setInterval(checkSessionExpiration, 1000);

      return () => {
        clearInterval(interval);
        window.removeEventListener('beforeunload', beforeUnloadHandler);
        window.onbeforeunload = null;
        noTimeout();
      };
    },
    [beforeUnloadHandler, noTimeout],
  );
};
