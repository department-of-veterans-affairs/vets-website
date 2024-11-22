import { useState, useEffect } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useBroadcastChannel } from '../useBroadcastChannel';

export const useVADX = () => {
  const [isDevLoading, setIsDevLoading] = useState(false);

  // feature toggles
  const [
    localToggles,
    setLocalToggles,
    clearLocalToggles,
  ] = useBroadcastChannel('vadx-toggles', {});

  // Default to toggles tab if no tab is set
  const [activeTab, setActiveTab] = useBroadcastChannel('vadx-tab', 'toggles');

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
