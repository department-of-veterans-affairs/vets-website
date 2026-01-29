import { useCallback, useMemo } from 'react';
import { useSessionExpiration } from './use-session-expiration';
import { resetUserSession } from '../util/helpers';

const useBeforeUnloadGuard = when => {
  const localStorageValues = useMemo(() => {
    return {
      atExpires: localStorage.atExpires,
      hasSession: localStorage.hasSession,
      sessionExpiration: localStorage.sessionExpiration,
      userFirstName: localStorage.userFirstName,
    };
  }, []);

  const { signOutMessage, timeoutId } = resetUserSession(localStorageValues);

  const noTimeout = useCallback(
    () => {
      clearTimeout(timeoutId);
    },
    [timeoutId],
  );

  const beforeUnloadHandler = useCallback(
    e => {
      if (when) {
        e.preventDefault();
        e.returnValue = signOutMessage;
      }
    },
    [when, signOutMessage],
  );

  useSessionExpiration(beforeUnloadHandler, noTimeout);
};

export default useBeforeUnloadGuard;
