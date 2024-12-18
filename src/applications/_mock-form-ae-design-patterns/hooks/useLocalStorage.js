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
      const item = localStorage.getItem(key);
      if (item === null) {
        currentValue = defaultValue;
      } else if (item.startsWith('{') || item.startsWith('[')) {
        currentValue = JSON.parse(item);
      } else {
        currentValue = item;
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error getting value from localStorage', error);
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
    setValue(defaultValue);
  };

  return [value, setValue, clearValue];
};
