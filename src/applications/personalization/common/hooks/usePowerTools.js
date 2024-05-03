import { useState } from 'react';
import useLocalStorage from './useLocalStorage';

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
