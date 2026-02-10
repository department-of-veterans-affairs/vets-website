import { useEffect, useRef } from 'react';
import {
  validateForm,
  getServiceDisplayName,
  INITIAL_FORM_FLAGS,
} from '../reducers/searchQuery';

/** Syncs URL params ↔ Redux ↔ draft state. */
const useSearchFormSync = ({
  currentQuery,
  draftFormState,
  setDraftFormState,
  updateDraftState,
  location,
  onChange,
  vaHealthServicesData,
}) => {
  // Refs to track values and prevent infinite loops
  const synchronizingRef = useRef(false);
  const draftSearchStringRef = useRef(draftFormState.searchString);
  // Track the last URL we synced from to avoid re-syncing when other
  // dependencies (like vaHealthServicesData) change but URL hasn't
  const lastSyncedUrlRef = useRef(null);

  // Keep ref updated with current draft search string
  draftSearchStringRef.current = draftFormState.searchString;

  // Sync searchString from Redux to draft when it changes externally
  useEffect(
    () => {
      const newSearchString = currentQuery.searchString || '';
      if (newSearchString !== draftSearchStringRef.current) {
        updateDraftState({ searchString: newSearchString });
      }
    },
    [currentQuery.searchString, updateDraftState],
  );

  // Sync URL params or Redux data to draft state on mount or URL change
  // Only re-syncs from URL if the URL actually changed (not when other deps change)
  useEffect(
    () => {
      if (synchronizingRef.current) {
        return;
      }

      const currentUrl = location?.search || '';
      const hasUrlParams =
        location?.search && Object.keys(location?.query || {}).length > 0;
      const urlChanged = currentUrl !== lastSyncedUrlRef.current;
      const isInitialSync = lastSyncedUrlRef.current === null;

      // Only sync from URL if URL actually changed or this is the initial sync
      // This prevents re-syncing old URL params when vaHealthServicesData loads
      const shouldSyncFromUrl = hasUrlParams && (urlChanged || isInitialSync);

      // Only sync from Redux on initial mount (when no URL to sync from)
      const hasReduxData =
        currentQuery.facilityType ||
        currentQuery.serviceType ||
        currentQuery.searchString;
      const shouldSyncFromRedux =
        isInitialSync && !hasUrlParams && hasReduxData;

      // Always mark initial sync as complete to prevent re-running
      // initial sync logic on subsequent renders
      if (!shouldSyncFromUrl && !shouldSyncFromRedux) {
        lastSyncedUrlRef.current = currentUrl;
        return;
      }

      if (shouldSyncFromUrl || shouldSyncFromRedux) {
        synchronizingRef.current = true;
        setDraftFormState(prev => {
          let stateFromUrl = null;
          let stateFromRedux = null;

          if (shouldSyncFromUrl) {
            const serviceType = location.query.serviceType || null;
            const facilityIsHealth = location.query.facilityType === 'health';

            let vamcServiceDisplay = location.query.vamcServiceDisplay || null;
            if (!vamcServiceDisplay && serviceType) {
              vamcServiceDisplay = getServiceDisplayName(
                serviceType,
                vaHealthServicesData,
              );
            } else if (!vamcServiceDisplay && facilityIsHealth) {
              vamcServiceDisplay = 'All VA health services';
            }

            stateFromUrl = {
              facilityType: location.query.facilityType || null,
              serviceType,
              searchString: location.query.address || '',
              vamcServiceDisplay,
              ...INITIAL_FORM_FLAGS,
            };
          }

          if (shouldSyncFromRedux) {
            const { serviceType } = currentQuery;
            const vamcServiceDisplay =
              currentQuery.vamcServiceDisplay ||
              (serviceType
                ? getServiceDisplayName(serviceType, vaHealthServicesData)
                : null);

            stateFromRedux = {
              facilityType: currentQuery.facilityType || null,
              serviceType,
              searchString: currentQuery.searchString || '',
              vamcServiceDisplay,
              ...INITIAL_FORM_FLAGS,
            };
          }

          const finalState = stateFromUrl || stateFromRedux;
          if (finalState) {
            // If we got state from URL, also update Redux to stay in sync
            const shouldUpdateReduxFromUrl = stateFromUrl && onChange;
            if (shouldUpdateReduxFromUrl) {
              onChange({
                facilityType: finalState.facilityType,
                serviceType: finalState.serviceType,
                searchString: finalState.searchString,
                vamcServiceDisplay: finalState.vamcServiceDisplay,
              });
            }
            return { ...finalState, ...validateForm(prev, finalState) };
          }
          return prev;
        });

        synchronizingRef.current = false;
        // Track the URL we synced from to detect actual URL changes
        lastSyncedUrlRef.current = currentUrl;
      }
    },
    // Using individual currentQuery properties instead of the full object
    // to avoid re-running on every Redux state change
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      location?.search,
      location?.query,
      currentQuery.facilityType,
      currentQuery.serviceType,
      currentQuery.searchString,
      currentQuery.vamcServiceDisplay,
      setDraftFormState,
      onChange,
      vaHealthServicesData,
    ],
  );

  // Sync vamcServiceDisplay from Redux to draft when it becomes available
  // This happens when vaHealthServicesData loads and FacilitiesMap resolves the display name
  useEffect(
    () => {
      if (
        currentQuery.vamcServiceDisplay &&
        !draftFormState.vamcServiceDisplay &&
        draftFormState.facilityType === 'health' &&
        draftFormState.serviceType // Only sync if serviceType is set (waiting for display name)
      ) {
        updateDraftState({
          vamcServiceDisplay: currentQuery.vamcServiceDisplay,
        });
      }
    },
    [
      currentQuery.vamcServiceDisplay,
      draftFormState.vamcServiceDisplay,
      draftFormState.facilityType,
      draftFormState.serviceType,
      updateDraftState,
    ],
  );
};

export default useSearchFormSync;
