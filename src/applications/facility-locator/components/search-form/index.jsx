import React, { useCallback, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import recordEvent from 'platform/monitoring/record-event';
import { focusElement } from 'platform/utilities/ui';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

// Utils
import { clearSearchText } from '../../actions/search';
import { clearGeocodeError, geolocateUser } from '../../actions/mapbox';
import { getProviderSpecialties } from '../../actions/locations';
import { LocationType } from '../../constants';
import {
  validateForm,
  createFormStateFromQuery,
  getServiceDisplayName,
  INITIAL_FORM_FLAGS,
} from '../../reducers/searchQuery';
import { setFocus } from '../../utils/helpers';
import { SearchFormTypes } from '../../types';

// Components
import BottomRow from './BottomRow';
import FacilityType from './facility-type';
import ServiceType from './service-type';
import AddressAutosuggest from './location/AddressAutosuggest';

/**
 * SearchForm implements a dual-state pattern to prevent premature UI updates:
 * - draftFormState (local React state): holds user input changes
 * - currentQuery (Redux state): holds committed values that drive search results
 *
 * Form inputs update draft state only. On submit, draft state commits to Redux.
 * This prevents search results from updating while user is still typing/editing.
 */
export const SearchForm = props => {
  const {
    currentQuery,
    isMobile,
    isSmallDesktop,
    isTablet,
    mobileMapUpdateEnabled,
    onChange,
    onSubmit,
    searchInitiated,
    selectMobileMapPin,
    setSearchInitiated,
    suppressPPMS,
    useProgressiveDisclosure,
    vamcAutoSuggestEnabled,
  } = props;

  const [selectedServiceType, setSelectedServiceType] = useState(null);
  const locationInputFieldRef = useRef(null);
  const lastQueryRef = useRef(null);
  const synchronizingRef = useRef(false);

  const draftSearchStringRef = useRef(null);
  const currentQueryRef = useRef(currentQuery);

  const [draftFormState, setDraftFormState] = useState(() =>
    createFormStateFromQuery(currentQuery),
  );

  draftSearchStringRef.current = draftFormState.searchString;
  currentQueryRef.current = currentQuery;

  const updateDraftState = useCallback(updater => {
    setDraftFormState(prev => {
      const updates =
        typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      return { ...updates, ...validateForm(prev, updates) };
    });
  }, []);

  const handleVamcDraftChange = useCallback(
    updates => updateDraftState(updates),
    [updateDraftState],
  );

  const handleLocationSelection = useCallback(
    updates => updateDraftState(updates),
    [updateDraftState],
  );

  const handleFacilityTypeChange = useCallback(
    e => {
      updateDraftState(prev => ({
        ...prev,
        facilityType: e.target.value,
        serviceType: null,
        vamcServiceDisplay: null,
      }));
    },
    [updateDraftState],
  );

  const handleServiceTypeChange = useCallback(
    ({ target, selectedItem }) => {
      setSelectedServiceType(selectedItem);
      const option = target.value.trim();
      const serviceType = option === 'All' ? null : option;
      updateDraftState({ serviceType });
    },
    [updateDraftState],
  );

  const handleSubmit = e => {
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
  };

  useEffect(
    () => {
      const newSearchString = currentQuery.searchString || '';
      if (newSearchString !== draftSearchStringRef.current) {
        updateDraftState({ searchString: newSearchString });
      }
    },
    [currentQuery.searchString, updateDraftState],
  );

  useEffect(
    () => {
      if (synchronizingRef.current) {
        return;
      }

      const hasUrlParams =
        props.location?.search &&
        Object.keys(props.location?.query || {}).length > 0;
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
            const serviceType = props.location.query.serviceType || null;
            const vamcServiceDisplay =
              props.location.query.vamcServiceDisplay ||
              (serviceType
                ? getServiceDisplayName(serviceType, props.vaHealthServicesData)
                : null);

            stateFromUrl = {
              facilityType: props.location.query.facilityType || null,
              serviceType,
              searchString: props.location.query.address || '',
              vamcServiceDisplay,
              ...INITIAL_FORM_FLAGS,
            };
          }

          if (hasReduxData) {
            const { serviceType } = currentQuery;
            const vamcServiceDisplay =
              currentQuery.vamcServiceDisplay ||
              (serviceType
                ? getServiceDisplayName(serviceType, props.vaHealthServicesData)
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
    [
      props.location?.search,
      currentQuery.facilityType,
      currentQuery.serviceType,
      currentQuery.searchString,
    ],
  );

  // Update vamcServiceDisplay in draft state when Redux is updated
  // (e.g., when vaHealthServicesData becomes available and FacilitiesMap resolves the display name)
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
    [currentQuery.vamcServiceDisplay],
  );

  const handleGeolocationButtonClick = e => {
    e.preventDefault();
    recordEvent({ event: 'fl-get-geolocation' });
    props.geolocateUser();
  };

  const handleClearInput = () => {
    props.clearSearchText();
    updateDraftState({ searchString: '' });
    if (locationInputFieldRef.current) {
      locationInputFieldRef.current.value = '';
    }
    focusElement('#street-city-state-zip');
  };

  // Set focus in the location field when manual geocoding completes
  useEffect(
    () => {
      if (
        currentQuery.geolocationInProgress === false &&
        locationInputFieldRef.current
      ) {
        setFocus(locationInputFieldRef.current, false);
      }
    },
    [currentQuery.geolocationInProgress],
  );

  // Track geocode errors
  useEffect(
    () => {
      if (currentQuery?.geocodeError) {
        switch (currentQuery.geocodeError) {
          case 0:
            break;
          case 1:
            recordEvent({
              event: 'fl-get-geolocation-permission-error',
              'error-key': '1_PERMISSION_DENIED',
            });
            break;
          case 2:
            recordEvent({
              event: 'fl-get-geolocation-other-error',
              'error-key': '2_POSITION_UNAVAILABLE',
            });
            break;
          default:
            recordEvent({
              event: 'fl-get-geolocation-other-error',
              'error-key': '3_TIMEOUT',
            });
        }
      }
    },
    [currentQuery.geocodeError],
  );

  const facilityAndServiceTypeInputs = (
    <>
      <FacilityType
        currentQuery={draftFormState}
        handleFacilityTypeChange={handleFacilityTypeChange}
        isMobile={isMobile}
        isSmallDesktop={isSmallDesktop}
        isTablet={isTablet}
        suppressPPMS={suppressPPMS}
        useProgressiveDisclosure={useProgressiveDisclosure}
      />
      <ServiceType
        currentQuery={draftFormState}
        getProviderSpecialties={props.getProviderSpecialties}
        handleServiceTypeChange={handleServiceTypeChange}
        isMobile={isMobile}
        isSmallDesktop={isSmallDesktop}
        isTablet={isTablet}
        committedVamcServiceDisplay={
          draftFormState.vamcServiceDisplay || currentQuery.vamcServiceDisplay
        }
        onVamcDraftChange={handleVamcDraftChange}
        searchInitiated={searchInitiated}
        setSearchInitiated={setSearchInitiated}
        useProgressiveDisclosure={useProgressiveDisclosure}
        vamcAutoSuggestEnabled={vamcAutoSuggestEnabled}
      />
    </>
  );

  return (
    <div
      className={
        isSmallDesktop && useProgressiveDisclosure
          ? 'desktop-search-controls-container clearfix'
          : 'search-controls-container clearfix'
      }
    >
      <VaModal
        uswds
        modalTitle={
          currentQuery.geocodeError === 1
            ? `Your device's location sharing is off.`
            : "We couldn't locate you"
        }
        onCloseEvent={() => props.clearGeocodeError()}
        status="warning"
        visible={currentQuery.geocodeError > 0}
      >
        <p>
          {currentQuery.geocodeError === 1
            ? 'To use your location when searching for a VA facility, go to the settings on your device and update sharing permissions.'
            : 'Sorry, something went wrong when trying to find your location. Please make sure location sharing is enabled and try again.'}
        </p>
      </VaModal>
      <form id="facility-search-controls" onSubmit={handleSubmit}>
        <AddressAutosuggest
          currentQuery={{
            ...draftFormState,
            geolocationInProgress: currentQuery.geolocationInProgress,
          }}
          geolocateUser={handleGeolocationButtonClick}
          inputRef={locationInputFieldRef}
          isMobile={isMobile}
          isSmallDesktop={isSmallDesktop}
          isTablet={isTablet}
          onClearClick={handleClearInput}
          onChange={onChange}
          onLocationSelection={handleLocationSelection}
          useProgressiveDisclosure={useProgressiveDisclosure}
        />
        {useProgressiveDisclosure ? (
          <>
            {facilityAndServiceTypeInputs}
            <va-button
              id="facility-search"
              onClick={handleSubmit}
              text="Search"
              full-width
            />
          </>
        ) : (
          <BottomRow isSmallDesktop={isSmallDesktop}>
            {facilityAndServiceTypeInputs}
            <div>
              <input id="facility-search" type="submit" value="Search" />
            </div>
          </BottomRow>
        )}
      </form>
    </div>
  );
};

const mapDispatchToProps = {
  clearGeocodeError,
  clearSearchText,
  geolocateUser,
  getProviderSpecialties,
};

SearchForm.propTypes = SearchFormTypes;

export default connect(
  null,
  mapDispatchToProps,
)(SearchForm);
