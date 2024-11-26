import { useState, useEffect } from 'react';

/**
 * useLocalStorage is a hook that provides a way to store and retrieve values from localStorage
 * @param {string} key - The key to store the value under
 * @param {any} defaultValue - The default value to use if the key does not exist
 * @returns {array} An array with [value, setValue, clearValue]
 */
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
