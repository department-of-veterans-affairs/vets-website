import React, {
  createContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';

import { debounce, isEqual } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useMockedLogin } from '../../hooks/useMockedLogin';
import { vadxPreferencesStorage } from '../utils/StorageAdapter';
import { setPowerToolsToggles } from '../panel/actions';

export const VADXContext = createContext(null);

/**
 * @typedef {Object} SyncContextValue
 * @property {Object} syncedData - The synchronized data
 * @property {Function} setSyncedData - Function to update synced data
 */

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @returns {React.ReactNode}
 * @component
 */
export const VADXProvider = ({ children }) => {
  const [preferences, setPreferences] = useState({});

  const dispatch = useDispatch();

  const broadcastChannel = useMemo(
    () => new BroadcastChannel(`vadx-preferences`),
    [],
  );

  const { logIn, logOut } = useMockedLogin();

  useEffect(
    () => {
      // Initialize data from IndexedDB
      const initializeData = async () => {
        try {
          const storedData = await vadxPreferencesStorage.get('preferences');
          if (storedData) {
            setPreferences(storedData);
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Failed to initialize preferences:', error);
        }
      };

      initializeData();

      // Listen for changes from other tabs
      broadcastChannel.onmessage = event => {
        setPreferences(event.data);
      };

      return () => {
        broadcastChannel.close();
      };
    },
    [broadcastChannel],
  );

  /**
   * Update synced data and notify other tabs
   * @param {Object} newData - New data to sync
   */
  const setSyncedData = useCallback(
    async newData => {
      try {
        // Update IndexedDB
        await vadxPreferencesStorage.set('preferences', newData);

        // Update local state
        setPreferences(newData);

        // Notify other tabs
        broadcastChannel.postMessage(newData);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to update preferences:', error);
        throw error;
      }
    },
    [broadcastChannel],
  );

  const updateDevLoading = isLoading => {
    setSyncedData({ ...preferences, isDevLoading: isLoading });
  };

  const updateSearchQuery = useCallback(
    query => {
      setSyncedData({ ...preferences, searchQuery: query });
    },
    [preferences, setSyncedData],
  );

  const updateActiveTab = tab => {
    setSyncedData({ ...preferences, activeTab: tab });
  };

  const updateShowVADX = show => {
    setSyncedData({ ...preferences, showVADX: show });
  };

  const updateLocalToggles = useCallback(
    toggles => {
      setSyncedData({ ...preferences, localToggles: toggles });
    },
    [preferences, setSyncedData],
  );

  const updateClearLocalToggles = () => {
    setSyncedData({ ...preferences, localToggles: {} });
    dispatch(setPowerToolsToggles({}));
  };

  const debouncedSetSearchQuery = useMemo(
    () => debounce(updateSearchQuery, 300),
    [updateSearchQuery],
  );

  const togglesLoading = useSelector(state => state?.featureToggles?.loading);

  const togglesState = useSelector(state => state?.featureToggles);

  const localTogglesAreEmpty = useMemo(
    () => isEqual(preferences?.localToggles, {}),
    [preferences?.localToggles],
  );

  const customLocalToggles =
    !localTogglesAreEmpty && !isEqual(preferences?.localToggles, togglesState);

  useEffect(
    () => {
      if (customLocalToggles) {
        dispatch(setPowerToolsToggles(preferences?.localToggles));
      }
    },
    [customLocalToggles, preferences?.localToggles, dispatch],
  );

  return (
    <VADXContext.Provider
      value={{
        logIn,
        logOut,
        preferences,
        setSyncedData,
        updateDevLoading,
        updateSearchQuery,
        updateActiveTab,
        updateShowVADX,
        updateLocalToggles,
        updateClearLocalToggles,
        debouncedSetSearchQuery,
        togglesLoading,
        togglesState,
      }}
    >
      {children}
    </VADXContext.Provider>
  );
};

VADXProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
