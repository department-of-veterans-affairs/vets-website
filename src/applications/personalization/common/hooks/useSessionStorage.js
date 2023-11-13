import { useEffect, useState } from 'react';

export const useSessionStorage = key => {
  if (!key) throw new Error('useSessionStorage requires a key parameter');

  const [sessionStorageValue, setSessionStorageValue] = useState('');

  useEffect(
    () => {
      const storedValue = sessionStorage.getItem(key);
      if (storedValue) {
        setSessionStorageValue(storedValue);
      }
    },
    [key],
  );

  useEffect(
    () => {
      sessionStorage.setItem(key, sessionStorageValue);
    },
    [key, sessionStorageValue],
  );

  return [sessionStorageValue, setSessionStorageValue];
};
