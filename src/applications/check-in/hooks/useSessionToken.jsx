import { useCallback } from 'react';
import { useSessionStorage } from './useSessionStorage';

const useSessionToken = (sessionNameSpace = 'health.care.pre.check.in') => {
  const {
    SESSION_STORAGE_KEYS,
    getSessionKey,
    setSessionKey,
  } = useSessionStorage(sessionNameSpace);

  const getCurrentToken = useCallback(
    window => getSessionKey(window, SESSION_STORAGE_KEYS.CURRENT_UUID),
    [SESSION_STORAGE_KEYS, getSessionKey],
  );

  const setCurrentToken = useCallback(
    (window, token) => {
      setSessionKey(window, SESSION_STORAGE_KEYS.CURRENT_UUID, {
        token,
      });
    },
    [SESSION_STORAGE_KEYS, setSessionKey],
  );

  return {
    getCurrentToken,
    setCurrentToken,
  };
};

export { useSessionToken };
