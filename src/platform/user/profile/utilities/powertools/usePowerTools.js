import { useState, useEffect } from 'react';

const useLocalStorage = (key, defaultValue) => {
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

export const usePowerTools = () => {
  const [isDevLoading, setIsDevLoading] = useState(false);

  const [localToggles, setLocalToggles, clearLocalToggles] = useLocalStorage(
    'va-power-tools-toggles',
    {},
  );

  const [showPowerTools, setShowPowerTools] = useLocalStorage(
    'va-power-tools-display',
    false,
  );

  const [searchQuery, setSearchQuery] = useLocalStorage(
    'va-power-tools-search',
    '',
  );

  const [activeTab, setActiveTab] = useLocalStorage(
    'va-power-tools-tab',
    'toggles',
  );

  return {
    isDevLoading,
    setIsDevLoading,
    localToggles,
    setLocalToggles,
    clearLocalToggles,
    showPowerTools,
    setShowPowerTools,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
  };
};
