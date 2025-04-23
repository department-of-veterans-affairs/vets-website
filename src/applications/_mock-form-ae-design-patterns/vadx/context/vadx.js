import React, {
  createContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';

import { debounce } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useMockedLogin } from '../../hooks/useMockedLogin';
import { vadxPreferencesStorage } from '../utils/StorageAdapter';
import { setVadxToggles } from '../actions/toggles';

/**
 * @typedef {Object} SyncContextValue
 * @property {Object} syncedData - The synchronized data
 * @property {Function} setSyncedData - Function to update synced data
 */

export const VADXContext = createContext(null);

/**
 * @component VADXProvider
 * @param {React.ReactNode} props.children
 * @returns {React.ReactNode}
 */
export const VADXProvider = ({ children }) => {
  const [preferences, setPreferences] = useState({});

  const dispatch = useDispatch();

  // Create a broadcast channel to synchronize data between tabs
  // this will act as a pub/sub system for the preferences
  const broadcastChannel = useMemo(
    () => new BroadcastChannel(`vadx-preferences`),
    [],
  );

  // mock login functions
  const { logIn, logOut, loggedIn } = useMockedLogin();

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

  const createUpdateHandlerByKey = key => {
    return update => {
      setSyncedData({ ...preferences, [key]: update });
    };
  };

  // update the loading state for the dev tools
  const updateDevLoading = isLoading => {
    setSyncedData({ ...preferences, isDevLoading: isLoading });
  };

  // update the search query for the dev tools
  const updateSearchQuery = useCallback(
    query => {
      setSyncedData({ ...preferences, searchQuery: query });
    },
    [preferences, setSyncedData],
  );

  // update the active tab for the dev tools
  const updateActiveTab = tab => {
    setSyncedData({ ...preferences, activeTab: tab });
  };

  // update the show state for the dev tools
  const updateShowVADX = show => {
    setSyncedData({ ...preferences, showVADX: show });
  };

  const updateFeApi = createUpdateHandlerByKey('feApiUrl');
  const updateBeApi = createUpdateHandlerByKey('beApiUrl');

  // update local toggles
  const updateLocalToggles = useCallback(
    async toggles => {
      await setSyncedData({
        ...preferences,
        localToggles: { ...toggles },
      });
      dispatch(setVadxToggles(toggles));
    },
    [preferences, setSyncedData, dispatch],
  );

  // clear local toggles
  const updateClearLocalToggles = () => {
    setSyncedData({ ...preferences, localToggles: {} });
    dispatch(setVadxToggles({}));
  };

  // debounce the search query for the dev tools toggle tab
  const debouncedSetSearchQuery = useMemo(
    () => debounce(updateSearchQuery, 300),
    [updateSearchQuery],
  );

  const togglesLoading = useSelector(state => state?.featureToggles?.loading);

  const togglesState = useSelector(state => state?.featureToggles);

  return (
    <VADXContext.Provider
      value={{
        preferences,
        togglesLoading,
        togglesState,
        logIn,
        logOut,
        loggedIn,
        setSyncedData,
        updateDevLoading,
        updateSearchQuery,
        updateActiveTab,
        updateShowVADX,
        updateLocalToggles,
        updateClearLocalToggles,
        updateFeApi,
        updateBeApi,
        debouncedSetSearchQuery,
      }}
    >
      {children}
    </VADXContext.Provider>
  );
};

VADXProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
