import { useCallback, useMemo } from 'react';
import { createSessionStorageKeys } from '../utils/session-storage';

const useSessionStorage = (isPreCheckIn = true, maxValidateAttempts = 3) => {
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

  const incrementValidateAttempts = window => {
    const validateAttempts =
      getSessionKey(window, SESSION_STORAGE_KEYS.VALIDATE_ATTEMPTS) ?? 0;
    setSessionKey(
      window,
      SESSION_STORAGE_KEYS.VALIDATE_ATTEMPTS,
      validateAttempts + 1,
    );
  };

  const getValidateAttempts = window => {
    const validateAttempts =
      getSessionKey(window, SESSION_STORAGE_KEYS.VALIDATE_ATTEMPTS) ?? 0;
    const isMaxValidateAttempts = validateAttempts >= maxValidateAttempts - 1;
    const remainingValidateAttempts = maxValidateAttempts - validateAttempts;
    return {
      isMaxValidateAttempts,
      remainingValidateAttempts,
    };
  };

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

  return {
    clearCurrentSession,
    setCurrentToken,
    getCurrentToken,
    setPreCheckinComplete,
    getPreCheckinComplete,
    incrementValidateAttempts,
    getValidateAttempts,
    setShouldSendDemographicsFlags,
    getShouldSendDemographicsFlags,
  };
};

export { useSessionStorage };
