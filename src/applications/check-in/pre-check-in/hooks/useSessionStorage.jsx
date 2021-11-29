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
      const { CURRENT_UUID } = SESSION_STORAGE_KEYS;
      sessionStorage.removeItem(CURRENT_UUID);
    },
    [SESSION_STORAGE_KEYS],
  );

  const getCurrentToken = useCallback(
    window => {
      if (!window) return null;
      const { sessionStorage } = window;
      const { CURRENT_UUID } = SESSION_STORAGE_KEYS;

      const key = CURRENT_UUID;

      const data = sessionStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    },
    [SESSION_STORAGE_KEYS],
  );

  const setCurrentToken = useCallback(
    (window, token) => {
      const { sessionStorage } = window;
      const { CURRENT_UUID } = SESSION_STORAGE_KEYS;
      const key = CURRENT_UUID;
      const data = { token };
      sessionStorage.setItem(key, JSON.stringify(data));
    },
    [SESSION_STORAGE_KEYS],
  );

  return {
    clearCurrentSession,
    getCurrentToken,
    setCurrentToken,
    SESSION_STORAGE_KEYS,
  };
};

export { useSessionStorage };
