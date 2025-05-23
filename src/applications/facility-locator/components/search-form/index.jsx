import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import recordEvent from 'platform/monitoring/record-event';
import { focusElement } from 'platform/utilities/ui';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

// Utils
import { clearSearchText } from '../../actions/search';
import { clearGeocodeError, geolocateUser } from '../../actions/mapbox';
import { getProviderSpecialties } from '../../actions/locations';
import { LocationType } from '../../constants';
import { setFocus } from '../../utils/helpers';
import { SearchFormTypes } from '../../types';

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

  const [selectedServiceType, setSelectedServiceType] = useState(null);
  const locationInputFieldRef = useRef(null);
  const lastQueryRef = useRef(null);

  const handleFacilityTypeChange = e => {
    onChange({
      facilityType: e.target.value,
      serviceType: null,
      // Since the facility type may cause an error (PPMS), reset it if the type is changed
      fetchSvcsError: null,
      error: null,
    });
  };

  const handleServiceTypeChange = ({ target, selectedItem }) => {
    setSelectedServiceType(selectedItem);

    const option = target.value.trim();
    const serviceType = option === 'All' ? null : option;
    onChange({ serviceType });
  };

  const handleSubmit = e => {
    e.preventDefault();

    const isSameQuery =
      lastQueryRef.current &&
      currentQuery.facilityType === lastQueryRef.current.facilityType &&
      currentQuery.serviceType === lastQueryRef.current.serviceType &&
      currentQuery.searchString === lastQueryRef.current.searchString &&
      currentQuery.zoomLevel === lastQueryRef.current.zoomLevel;

    if (isSameQuery) {
      return;
    }

    lastQueryRef.current = currentQuery;

    const {
      facilityType,
      serviceType,
      zoomLevel,
      isValid,
      searchString,
      specialties,
    } = currentQuery;

    let analyticsServiceType = serviceType;

    const updateReduxState = propName => {
      onChange({ [propName]: ' ' });
      onChange({ [propName]: '' });
    };

    if (facilityType === LocationType.CC_PROVIDER) {
      if (!serviceType || !selectedServiceType) {
        updateReduxState('serviceType');
        focusElement('#service-type-ahead-input');
        return;
      }

      if (specialties && Object.keys(specialties).includes(serviceType)) {
        analyticsServiceType = specialties[serviceType];
      }
    }

    if (!searchString) {
      updateReduxState('searchString');
      focusElement('#street-city-state-zip');
      return;
    }

    if (!facilityType) {
      updateReduxState('facilityType');
      focusElement('#facility-type-dropdown');
      return;
    }

    if (!isValid) {
      return;
    }

    // Report event here to only send analytics event when a user clicks on the button
    recordEvent({
      event: 'fl-search',
      'fl-search-fac-type': facilityType,
      'fl-search-svc-type': analyticsServiceType,
      'fl-current-zoom-depth': zoomLevel,
    });

    if (isMobile && mobileMapUpdateEnabled) {
      selectMobileMapPin(null);
    }

    setSearchInitiated(true);
    onSubmit();
  };

  const handleGeolocationButtonClick = e => {
    e.preventDefault();
    recordEvent({
      event: 'fl-get-geolocation',
    });

    props.geolocateUser();
  };

  const handleClearInput = () => {
    props.clearSearchText();
    // optional chaining not allowed
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
        currentQuery={currentQuery}
        handleFacilityTypeChange={handleFacilityTypeChange}
        isMobile={isMobile}
        isSmallDesktop={isSmallDesktop}
        isTablet={isTablet}
        suppressPPMS={suppressPPMS}
        useProgressiveDisclosure={useProgressiveDisclosure}
      />
      <ServiceType
        currentQuery={currentQuery}
        getProviderSpecialties={props.getProviderSpecialties}
        handleServiceTypeChange={handleServiceTypeChange}
        isMobile={isMobile}
        isSmallDesktop={isSmallDesktop}
        isTablet={isTablet}
        onChange={onChange}
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
          currentQuery={currentQuery}
          geolocateUser={handleGeolocationButtonClick}
          inputRef={locationInputFieldRef}
          isMobile={isMobile}
          isSmallDesktop={isSmallDesktop}
          isTablet={isTablet}
          onClearClick={handleClearInput}
          onChange={onChange}
          useProgressiveDisclosure={useProgressiveDisclosure}
        />
        {useProgressiveDisclosure ? (
          <>
            {facilityAndServiceTypeInputs}
            <va-button
              id="facility-search"
              submit="prevent"
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
