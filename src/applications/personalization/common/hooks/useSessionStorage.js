import { useEffect, useState } from 'react';

export const useSessionStorage = (
  storageKey,
  sessionStorage = window.sessionStorage,
) => {
  if (!storageKey)
    throw new Error(
      'useSessionStorage requires a storageKey parameter as the first argument',
    );

  // use whatever existing value is in sessionStorage or initialize to empty string
  const [sessionStorageValue, setSessionStorageValue] = useState(() => {
    const storedValue = sessionStorage.getItem(storageKey);
    return storedValue ?? '';
  });

  // update sessionStorage when sessionStorageValue changes
  useEffect(() => {
    const currentValue = sessionStorage.getItem(storageKey);
    if (sessionStorageValue !== currentValue) {
      sessionStorage.setItem(storageKey, sessionStorageValue);
    }
  }, [storageKey, sessionStorageValue, sessionStorage]);

  return [sessionStorageValue, setSessionStorageValue];
};
