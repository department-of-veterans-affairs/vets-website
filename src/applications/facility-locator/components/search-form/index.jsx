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
import useSearchSubmit from '../../hooks/useSearchSubmit';

// Components
import BottomRow from './BottomRow';
import FacilityType from './facility-type';
import ServiceType from './service-type';
import AddressAutosuggest from './location/AddressAutosuggest';

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

  const {
    draftFormState,
    setDraftFormState,
    updateDraftState,
    handleFacilityTypeChange,
    handleServiceTypeChange,
    selectedServiceType,
  } = useSearchFormState(currentQuery);

  useSearchFormSync({
    currentQuery,
    draftFormState,
    setDraftFormState,
    updateDraftState,
    location: props.location,
    onChange,
    vaHealthServicesData: props.vaHealthServicesData,
  });

  useEffect(
    () => {
      if (currentQuery?.geocodeError) {
        if (currentQuery.geocodeError === 1) {
          recordEvent({
            event: 'fl-get-geolocation-permission-error',
            'error-key': '1_PERMISSION_DENIED',
          });
        } else {
          recordEvent({
            event: 'fl-get-geolocation-other-error',
            'error-key':
              currentQuery.geocodeError === 2
                ? '2_POSITION_UNAVAILABLE'
                : '3_TIMEOUT',
          });
        }
      }
    },
    [currentQuery.geocodeError],
  );

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
        onVamcDraftChange={updateDraftState}
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
          onLocationSelection={updateDraftState}
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
