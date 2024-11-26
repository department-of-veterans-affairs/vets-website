import { useEffect } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useBroadcastStorage } from '../useBroadcastStorage';

export const useVADX = () => {
  const { useStorageForKey } = useBroadcastStorage({
    dbName: 'vadx',
    storeName: 'preferences',
  });

  // feature toggles
  const [localToggles, setLocalToggles, clearLocalToggles] = useLocalStorage(
    'vadx-toggles',
    {},
  );

  // Default to toggles tab if no tab is set
  const [activeTab, setActiveTab] = useLocalStorage('vadx-tab', 'toggles');

  const [showVADX, setShowVADX] = useStorageForKey('vadx-display', false);

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
