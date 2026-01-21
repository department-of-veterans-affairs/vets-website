import { useCallback, useRef } from 'react';
import recordEvent from 'platform/monitoring/record-event';
import { focusElement } from 'platform/utilities/ui';
import { LocationType } from '../constants';

/** Handles form validation and submission. */
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
  const lastQueryRef = useRef(null);

  const handleSubmit = useCallback(
    e => {
      e.preventDefault();

      const isSameQuery =
        lastQueryRef.current &&
        draftFormState.facilityType === lastQueryRef.current.facilityType &&
        draftFormState.serviceType === lastQueryRef.current.serviceType &&
        draftFormState.searchString === lastQueryRef.current.searchString &&
        currentQuery.zoomLevel === lastQueryRef.current.zoomLevel;

      if (isSameQuery) {
        return;
      }

      // CC_PROVIDER serviceType validation first (matches E2E test expectations)
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

      if (!draftFormState.searchString) {
        setDraftFormState(prev => ({
          ...prev,
          locationChanged: true,
          isValid: false,
        }));
        setTimeout(() => focusElement('#street-city-state-zip'), 0);
        return;
      }

      if (!draftFormState.facilityType) {
        setDraftFormState(prev => ({
          ...prev,
          facilityTypeChanged: true,
          isValid: false,
        }));
        setTimeout(() => focusElement('#facility-type-dropdown'), 0);
        return;
      }

      lastQueryRef.current = {
        facilityType: draftFormState.facilityType,
        serviceType: draftFormState.serviceType,
        searchString: draftFormState.searchString,
        zoomLevel: currentQuery.zoomLevel,
      };

      onChange({
        facilityType: draftFormState.facilityType,
        serviceType: draftFormState.serviceType,
        searchString: draftFormState.searchString,
        vamcServiceDisplay: draftFormState.vamcServiceDisplay,
      });

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

      if (isMobile && mobileMapUpdateEnabled) {
        selectMobileMapPin(null);
      }

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
