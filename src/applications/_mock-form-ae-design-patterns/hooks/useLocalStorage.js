import { useState, useEffect } from 'react';

export const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    let currentValue;

    try {
      currentValue = JSON.parse(
        localStorage.getItem(key) || String(defaultValue),
      );
    } catch (error) {
      currentValue = defaultValue;
    }

    return currentValue;
  });

  useEffect(
    () => {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key],
  );

  const clearValue = () => {
    localStorage.removeItem(key);
  };

  return [value, setValue, clearValue];
};
