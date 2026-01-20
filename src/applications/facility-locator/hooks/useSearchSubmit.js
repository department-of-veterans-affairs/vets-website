import { useCallback, useRef } from 'react';
import recordEvent from 'platform/monitoring/record-event';
import { focusElement } from 'platform/utilities/ui';
import { LocationType } from '../constants';

/**
 * Custom hook for handling search form submission.
 *
 * Manages form validation, duplicate query prevention, analytics recording,
 * and coordinating the submission flow between Redux and the search action.
 *
 * @param {Object} options - Hook options
 * @param {Object} options.draftFormState - Current draft form state
 * @param {Function} options.setDraftFormState - Setter for draft form state
 * @param {Object} options.selectedServiceType - Selected service type object (for CC_PROVIDER validation)
 * @param {Object} options.currentQuery - Current Redux query state
 * @param {Function} options.onChange - Callback to update Redux state
 * @param {Function} options.onSubmit - Callback to trigger search
 * @param {boolean} options.isMobile - Whether in mobile view
 * @param {boolean} options.mobileMapUpdateEnabled - Whether mobile map updates are enabled
 * @param {Function} options.selectMobileMapPin - Callback to clear mobile map pin
 * @param {Function} options.setSearchInitiated - Callback to set search initiated flag
 * @returns {Object} Object containing handleSubmit function
 */
const useSearchSubmit = ({
  draftFormState,
  setDraftFormState,
  selectedServiceType,
  currentQuery,
  onChange,
  onSubmit,
  isMobile,
  mobileMapUpdateEnabled,
  selectMobileMapPin,
  setSearchInitiated,
}) => {
  // Track last submitted query to prevent duplicate submissions
  const lastQueryRef = useRef(null);

  const handleSubmit = useCallback(
    e => {
      e.preventDefault();

      // Check if this is a duplicate query
      const isSameQuery =
        lastQueryRef.current &&
        draftFormState.facilityType === lastQueryRef.current.facilityType &&
        draftFormState.serviceType === lastQueryRef.current.serviceType &&
        draftFormState.searchString === lastQueryRef.current.searchString &&
        currentQuery.zoomLevel === lastQueryRef.current.zoomLevel;

      if (isSameQuery) {
        return;
      }

      // Validate searchString (location) is provided
      if (!draftFormState.searchString) {
        setDraftFormState(prev => ({
          ...prev,
          locationChanged: true,
          isValid: false,
        }));
        setTimeout(() => focusElement('#street-city-state-zip'), 0);
        return;
      }

      // Validate facilityType is selected
      if (!draftFormState.facilityType) {
        setDraftFormState(prev => ({
          ...prev,
          facilityTypeChanged: true,
          isValid: false,
        }));
        setTimeout(() => focusElement('#facility-type-dropdown'), 0);
        return;
      }

      // Validate serviceType for Community Care providers
      if (
        draftFormState.facilityType === LocationType.CC_PROVIDER &&
        (!draftFormState.serviceType || !selectedServiceType)
      ) {
        setDraftFormState(prev => ({
          ...prev,
          serviceTypeChanged: true,
          isValid: false,
        }));
        setTimeout(() => focusElement('#service-type-ahead-input'), 0);
        return;
      }

      // Store this query to prevent duplicate submissions
      lastQueryRef.current = {
        facilityType: draftFormState.facilityType,
        serviceType: draftFormState.serviceType,
        searchString: draftFormState.searchString,
        zoomLevel: currentQuery.zoomLevel,
      };

      // Update Redux state
      onChange({
        facilityType: draftFormState.facilityType,
        serviceType: draftFormState.serviceType,
        searchString: draftFormState.searchString,
        vamcServiceDisplay: draftFormState.vamcServiceDisplay,
      });

      // Record analytics with specialty display name for CC providers
      let analyticsServiceType = draftFormState.serviceType;
      const specialtyDisplayName =
        currentQuery.specialties?.[draftFormState.serviceType];

      if (
        draftFormState.facilityType === LocationType.CC_PROVIDER &&
        currentQuery.specialties &&
        specialtyDisplayName
      ) {
        analyticsServiceType = specialtyDisplayName;
      }

      recordEvent({
        event: 'fl-search',
        'fl-search-fac-type': draftFormState.facilityType,
        'fl-search-svc-type': analyticsServiceType,
        'fl-current-zoom-depth': currentQuery.zoomLevel,
      });

      // Clear mobile map pin if needed
      if (isMobile && mobileMapUpdateEnabled) {
        selectMobileMapPin(null);
      }

      // Trigger the search
      setSearchInitiated(true);
      onSubmit({
        facilityType: draftFormState.facilityType,
        serviceType: draftFormState.serviceType,
        searchString: draftFormState.searchString,
        vamcServiceDisplay: draftFormState.vamcServiceDisplay,
      });
    },
    [
      draftFormState,
      setDraftFormState,
      selectedServiceType,
      currentQuery.zoomLevel,
      currentQuery.specialties,
      onChange,
      onSubmit,
      isMobile,
      mobileMapUpdateEnabled,
      selectMobileMapPin,
      setSearchInitiated,
    ],
  );

  return { handleSubmit };
};

export default useSearchSubmit;
