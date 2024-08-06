import React from 'react';

export const useLocalStorage = (storageKey, fallbackState) => {
  const [value, setValue] = React.useState(
    JSON.parse(localStorage.getItem(storageKey)) ?? fallbackState,
  );

  React.useEffect(
    () => {
      localStorage.setItem(storageKey, JSON.stringify(value));
    },
    [value, storageKey],
  );

  return [value, setValue];
};
