import { useCallback, useMemo } from 'react';

const useSessionStorage = (isPreCheckIn = true) => {
  const SESSION_STORAGE_KEYS = useMemo(
    () => {
      const namespace = isPreCheckIn
        ? 'health.care.pre.check.in'
        : 'health.care.check-in';
      return {
        CURRENT_UUID: `${namespace}.current.uuid`,
      };
    },
    [isPreCheckIn],
  );

  const clearCurrentSession = useCallback(
    window => {
      const { sessionStorage } = window;
      Object.keys(SESSION_STORAGE_KEYS).forEach(key => {
        sessionStorage.removeItem(SESSION_STORAGE_KEYS[key]);
      });
    },
    [SESSION_STORAGE_KEYS],
  );

  const setSessionKey = (window, key, value) => {
    if (!window) return;
    const { sessionStorage } = window;
    sessionStorage.setItem(key, JSON.stringify(value));
  };

  const getSessionKey = (window, key) => {
    if (!window) return null;
    const { sessionStorage } = window;
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  };

  const setCurrentToken = useCallback(
    (window, token) => {
      setSessionKey(window, SESSION_STORAGE_KEYS.CURRENT_UUID, { token });
    },
    [SESSION_STORAGE_KEYS],
  );

  const getCurrentToken = useCallback(
    window => {
      return getSessionKey(window, SESSION_STORAGE_KEYS.CURRENT_UUID);
    },
    [SESSION_STORAGE_KEYS],
  );

  return {
    clearCurrentSession,
    setCurrentToken,
    getCurrentToken,
  };
};

export { useSessionStorage };
