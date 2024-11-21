import { useState, useEffect } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export const useVADX = () => {
  const [isDevLoading, setIsDevLoading] = useState(false);

  const [localToggles, setLocalToggles, clearLocalToggles] = useLocalStorage(
    'vadx-toggles',
    {},
  );

  const [showVADX, setShowVADX] = useLocalStorage('vadx-display', false);

  const [searchQuery, setSearchQuery] = useLocalStorage(
    'vadx-toggle-search',
    '',
  );

  useEffect(
    () => {
      const handleKeyDown = event => {
        if (
          (event?.metaKey || event?.ctrlKey) &&
          event?.shiftKey &&
          event?.key === 'Home'
        ) {
          event.preventDefault();
          setShowVADX(!showVADX);
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      // Clean up function to remove the event listener
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    },
    [showVADX, setShowVADX],
  );
  // Default to toggles tab if no tab is set
  const [activeTab, setActiveTab] = useLocalStorage('vadx-tab', 'toggles');

  return {
    isDevLoading,
    setIsDevLoading,
    localToggles,
    setLocalToggles,
    clearLocalToggles,
    showVADX,
    setShowVADX,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
  };
};
