import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import recordEvent from 'platform/monitoring/record-event';
import { focusElement } from 'platform/utilities/ui';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

// Utils
import { clearSearchText } from '../../actions/search';
import { clearGeocodeError, geolocateUser } from '../../actions/mapbox';
import { getProviderSpecialties } from '../../actions/locations';
import { setFocus } from '../../utils/helpers';
import { SearchFormTypes } from '../../types';

// Hooks
import useSearchFormState from '../../hooks/useSearchFormState';
import useSearchFormSync from '../../hooks/useSearchFormSync';
import useGeolocationAnalytics from '../../hooks/useGeolocationAnalytics';
import useSearchSubmit from '../../hooks/useSearchSubmit';

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

  // Form state management via custom hook
  const {
    draftFormState,
    setDraftFormState,
    updateDraftState,
    handleFacilityTypeChange,
    handleServiceTypeChange,
    handleLocationSelection,
    handleVamcDraftChange,
    selectedServiceType,
  } = useSearchFormState(currentQuery);

  // Synchronize URL params, Redux, and draft state
  useSearchFormSync({
    currentQuery,
    draftFormState,
    setDraftFormState,
    updateDraftState,
    location: props.location,
    onChange,
    vaHealthServicesData: props.vaHealthServicesData,
  });

  // Track geolocation errors for analytics
  useGeolocationAnalytics(currentQuery.geocodeError);

  // Form submission handling
  const { handleSubmit } = useSearchSubmit({
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
  });

  const locationInputFieldRef = useRef(null);

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
          draftFormState.vamcServiceDisplay ||
          (draftFormState.serviceType && currentQuery.vamcServiceDisplay)
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
