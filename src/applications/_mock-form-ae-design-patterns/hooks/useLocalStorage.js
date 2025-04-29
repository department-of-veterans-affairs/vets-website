import { useState, useEffect } from 'react';
/**
 * useLocalStorage is a hook that provides a way to store and retrieve values from localStorage
 * @param {string} key - The key to store the value under
 * @param {any} defaultValue - The default value to use if the key does not exist
 * @param {boolean} json - Whether to parse the value as JSON, this way a stringified object can be stored and retrieved as an object
 * @returns {array} An array with [value, setValue, clearValue]
 */
export const useLocalStorage = (key, defaultValue, json = false) => {
  const [value, setValue] = useState(() => {
    let currentValue;

    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        currentValue = defaultValue;
      } else if (json && (item.startsWith('{') || item.startsWith('['))) {
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
      if (value === null) {
        localStorage.removeItem(key);
        return;
      }
      if (json) {
        localStorage.setItem(key, JSON.stringify(value));
        return;
      }
      localStorage.setItem(key, value);
    },
    [value, key, json],
  );

  const clearValue = () => {
    setValue(null);
  };

  return [value, setValue, clearValue];
};
