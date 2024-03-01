import { useCallback, useMemo } from 'react';
import { createStorageKeys } from '../utils/storage';

const useStorage = (app, local = false) => {
  const STORAGE_KEYS = useMemo(
    () => {
      return createStorageKeys({ app });
    },
    [app],
  );

  const clearCurrentStorage = useCallback(
    window => {
      const { sessionStorage, localStorage } = window;
      Object.keys(STORAGE_KEYS).forEach(key => {
        if (local) localStorage.removeItem(STORAGE_KEYS[key]);
        else sessionStorage.removeItem(STORAGE_KEYS[key]);
      });
    },
    [STORAGE_KEYS, local],
  );

  const setKey = useCallback(
    (window, key, value) => {
      if (!window) return;
      const { sessionStorage, localStorage } = window;
      if (local) localStorage.setItem(key, JSON.stringify(value));
      else sessionStorage.setItem(key, JSON.stringify(value));
    },
    [local],
  );

  const getKey = useCallback(
    (window, key) => {
      if (!window) return null;
      const { sessionStorage, localStorage } = window;
      let data;
      if (local) data = localStorage.getItem(key);
      else data = sessionStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    },
    [local],
  );

  const setCurrentToken = useCallback(
    (window, token) => {
      setKey(window, STORAGE_KEYS.CURRENT_UUID, { token });
    },
    [STORAGE_KEYS, setKey],
  );

  const getCurrentToken = useCallback(
    window => {
      return getKey(window, STORAGE_KEYS.CURRENT_UUID);
    },
    [STORAGE_KEYS, getKey],
  );

  const setPreCheckinComplete = useCallback(
    (window, complete) => {
      setKey(window, STORAGE_KEYS.COMPLETE, { complete });
    },
    [STORAGE_KEYS, setKey],
  );

  const getPreCheckinComplete = useCallback(
    window => {
      return getKey(window, STORAGE_KEYS.COMPLETE);
    },
    [STORAGE_KEYS, getKey],
  );

  const setCheckinComplete = useCallback(
    (window, value) => {
      setKey(window, STORAGE_KEYS.CHECK_IN_COMPLETE, value);
    },
    [STORAGE_KEYS, setKey],
  );

  const getCheckinComplete = useCallback(
    window => {
      return getKey(window, STORAGE_KEYS.CHECK_IN_COMPLETE);
    },
    [STORAGE_KEYS, getKey],
  );

  const setShouldSendDemographicsFlags = useCallback(
    (window, value) => {
      setKey(window, STORAGE_KEYS.SHOULD_SEND_DEMOGRAPHICS_FLAGS, value);
    },
    [STORAGE_KEYS, setKey],
  );

  const getShouldSendDemographicsFlags = useCallback(
    window => {
      return (
        getKey(window, STORAGE_KEYS.SHOULD_SEND_DEMOGRAPHICS_FLAGS) ?? true
      );
    },
    [STORAGE_KEYS, getKey],
  );

  const setShouldSendTravelPayClaim = useCallback(
    (window, value) => {
      setKey(window, STORAGE_KEYS.SHOULD_SEND_TRAVEL_PAY_CLAIM, value);
    },
    [STORAGE_KEYS, setKey],
  );

  const getShouldSendTravelPayClaim = useCallback(
    window => {
      return getKey(window, STORAGE_KEYS.SHOULD_SEND_TRAVEL_PAY_CLAIM) ?? true;
    },
    [STORAGE_KEYS, getKey],
  );

  const setProgressState = useCallback(
    (window, value) => {
      setKey(window, STORAGE_KEYS.PROGRESS_STATE, value);
    },
    [STORAGE_KEYS, setKey],
  );

  const getProgressState = useCallback(
    window => {
      return getKey(window, STORAGE_KEYS.PROGRESS_STATE);
    },
    [STORAGE_KEYS, getKey],
  );

  const setPermissions = useCallback(
    (window, value) => {
      setKey(window, STORAGE_KEYS.PERMISSIONS, value);
    },
    [STORAGE_KEYS, setKey],
  );

  const getPermissions = useCallback(
    window => {
      return getKey(window, STORAGE_KEYS.PERMISSIONS);
    },
    [STORAGE_KEYS, getKey],
  );

  const setTravelPaySent = useCallback(
    (window, value) => {
      setKey(window, STORAGE_KEYS.TRAVELPAY_SENT, value);
    },
    [STORAGE_KEYS, setKey],
  );

  const getTravelPaySent = useCallback(
    window => {
      const value = getKey(window, STORAGE_KEYS.TRAVELPAY_SENT);
      return value || {};
    },
    [STORAGE_KEYS, getKey],
  );

  return {
    clearCurrentStorage,
    setCurrentToken,
    getCurrentToken,
    setPreCheckinComplete,
    getPreCheckinComplete,
    setCheckinComplete,
    getCheckinComplete,
    setShouldSendDemographicsFlags,
    getShouldSendDemographicsFlags,
    setShouldSendTravelPayClaim,
    getShouldSendTravelPayClaim,
    setProgressState,
    getProgressState,
    setPermissions,
    getPermissions,
    setTravelPaySent,
    getTravelPaySent,
  };
};

export { useStorage };
