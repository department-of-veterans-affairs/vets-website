import { useCallback, useMemo } from 'react';
import { createSessionStorageKeys } from '../utils/session-storage';

const useSessionStorage = (isPreCheckIn = true) => {
  const SESSION_STORAGE_KEYS = useMemo(
    () => {
      return createSessionStorageKeys({ isPreCheckIn });
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

  const setPreCheckinComplete = useCallback(
    (window, complete) => {
      setSessionKey(window, SESSION_STORAGE_KEYS.COMPLETE, { complete });
    },
    [SESSION_STORAGE_KEYS],
  );

  const getPreCheckinComplete = useCallback(
    window => {
      return getSessionKey(window, SESSION_STORAGE_KEYS.COMPLETE);
    },
    [SESSION_STORAGE_KEYS],
  );

  const setShouldSendDemographicsFlags = useCallback(
    (window, value) => {
      setSessionKey(
        window,
        SESSION_STORAGE_KEYS.SHOULD_SEND_DEMOGRAPHICS_FLAGS,
        value,
      );
    },
    [SESSION_STORAGE_KEYS],
  );

  const getShouldSendDemographicsFlags = useCallback(
    window => {
      return (
        getSessionKey(
          window,
          SESSION_STORAGE_KEYS.SHOULD_SEND_DEMOGRAPHICS_FLAGS,
        ) ?? true
      );
    },
    [SESSION_STORAGE_KEYS],
  );

  const setShouldSendTravelPayClaim = useCallback(
    (window, value) => {
      setSessionKey(
        window,
        SESSION_STORAGE_KEYS.SHOULD_SEND_TRAVEL_PAY_CLAIM,
        value,
      );
    },
    [SESSION_STORAGE_KEYS],
  );

  const getShouldSendTravelPayClaim = useCallback(
    window => {
      return (
        getSessionKey(
          window,
          SESSION_STORAGE_KEYS.SHOULD_SEND_TRAVEL_PAY_CLAIM,
        ) ?? true
      );
    },
    [SESSION_STORAGE_KEYS],
  );

  const setProgressState = useCallback(
    (window, value) => {
      setSessionKey(window, SESSION_STORAGE_KEYS.PROGRESS_STATE, value);
    },
    [SESSION_STORAGE_KEYS],
  );

  const getProgressState = useCallback(
    window => {
      return getSessionKey(window, SESSION_STORAGE_KEYS.PROGRESS_STATE);
    },
    [SESSION_STORAGE_KEYS],
  );

  const setPermissions = useCallback(
    (window, value) => {
      setSessionKey(window, SESSION_STORAGE_KEYS.PERMISSIONS, value);
    },
    [SESSION_STORAGE_KEYS],
  );

  const getPermissions = useCallback(
    window => {
      return getSessionKey(window, SESSION_STORAGE_KEYS.PERMISSIONS);
    },
    [SESSION_STORAGE_KEYS],
  );

  return {
    clearCurrentSession,
    setCurrentToken,
    getCurrentToken,
    setPreCheckinComplete,
    getPreCheckinComplete,
    setShouldSendDemographicsFlags,
    getShouldSendDemographicsFlags,
    setShouldSendTravelPayClaim,
    getShouldSendTravelPayClaim,
    setProgressState,
    getProgressState,
    setPermissions,
    getPermissions,
  };
};

export { useSessionStorage };
