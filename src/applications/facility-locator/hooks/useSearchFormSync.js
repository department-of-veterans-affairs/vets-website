import { useEffect, useRef } from 'react';
import {
  validateForm,
  getServiceDisplayName,
  INITIAL_FORM_FLAGS,
} from '../reducers/searchQuery';

/**
 * Custom hook for synchronizing search form state between URL params, Redux, and draft state.
 *
 * Handles three synchronization scenarios:
 * 1. URL params → draft state → Redux (on mount with URL params)
 * 2. Redux searchString changes → draft state (when Redux updates externally)
 * 3. Redux vamcServiceDisplay → draft state (when service data becomes available)
 *
 * @param {Object} options - Hook options
 * @param {Object} options.currentQuery - The current Redux query state
 * @param {Object} options.draftFormState - The current draft form state
 * @param {Function} options.setDraftFormState - Setter for draft form state
 * @param {Function} options.updateDraftState - Update function with validation
 * @param {Object} options.location - Router location object with search and query
 * @param {Function} options.onChange - Callback to update Redux state
 * @param {Object} options.vaHealthServicesData - VA health services data for display names
 */
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

  // Sync URL params or Redux data to draft state on mount/change
  useEffect(
    () => {
      if (synchronizingRef.current) {
        return;
      }

      const hasUrlParams =
        location?.search && Object.keys(location?.query || {}).length > 0;
      const hasReduxData =
        currentQuery.facilityType ||
        currentQuery.serviceType ||
        currentQuery.searchString;

      if (hasUrlParams || hasReduxData) {
        synchronizingRef.current = true;
        setDraftFormState(prev => {
          let stateFromUrl = null;
          let stateFromRedux = null;

          if (hasUrlParams) {
            const serviceType = location.query.serviceType || null;
            const vamcServiceDisplay =
              location.query.vamcServiceDisplay ||
              (serviceType
                ? getServiceDisplayName(serviceType, vaHealthServicesData)
                : null);

            stateFromUrl = {
              facilityType: location.query.facilityType || null,
              serviceType,
              searchString: location.query.address || '',
              vamcServiceDisplay,
              ...INITIAL_FORM_FLAGS,
            };
          }

          if (hasReduxData) {
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
        draftFormState.facilityType === 'health'
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
      updateDraftState,
    ],
  );
};

export default useSearchFormSync;
