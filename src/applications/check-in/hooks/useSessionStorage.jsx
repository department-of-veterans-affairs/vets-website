import { useCallback, useMemo } from 'react';

const useSessionStorage = (sessionNameSpace = 'health.care.pre.check.in') => {
  const SESSION_STORAGE_KEYS = useMemo(
    () => {
      return {
        CURRENT_UUID: `${sessionNameSpace}.current.uuid`,
      };
    },
    [sessionNameSpace],
  );

  const clearCurrentSession = useCallback(
    window => {
      const { sessionStorage } = window;
      Object.keys(SESSION_STORAGE_KEYS).forEach(key => {
        sessionStorage.removeItem(key);
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

  return {
    clearCurrentSession,
    getSessionKey,
    setSessionKey,
    SESSION_STORAGE_KEYS,
  };
};

export { useSessionStorage };
