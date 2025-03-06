import React, { useEffect, useRef, useState } from 'react';
import recordEvent from 'platform/monitoring/record-event';
import { focusElement } from 'platform/utilities/ui';
import classNames from 'classnames';
import {
  VaModal,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  healthServices,
  benefitsServices,
  urgentCareServices,
  facilityTypesOptions,
  emergencyCareServices,
  nonPPMSfacilityTypeOptions,
} from '../../config';
import { LocationType } from '../../constants';
import { setFocus } from '../../utils/helpers';
import { SearchFormTypes } from '../../types';
import AddressAutosuggest from './location/AddressAutosuggest';
import CCServiceTypeAhead from './service-type/CCServiceTypeAhead';
import ServicesLoadingOrShow from './service-type/ServicesLoadingOrShow';
import BottomRow from './BottomRow';

const SearchForm = props => {
  const {
    clearGeocodeError,
    clearSearchText,
    currentQuery,
    facilitiesUseAddressTypeahead,
    geolocateUser,
    getProviderSpecialties,
    isMobile,
    isSmallDesktop,
    isTablet,
    mobileMapUpdateEnabled,
    onChange,
    onSubmit,
    selectMobileMapPin,
    useProgressiveDisclosure,
  } = props;

  const [selectedServiceType, setSelectedServiceType] = useState(null);
  const locationInputFieldRef = useRef(null);

  const onlySpaces = str => /^\s+$/.test(str);

  const handleQueryChange = e => {
    // prevent users from entering only spaces
    // because this will not trigger a change
    // when they exit the field
    onChange({
      searchString: onlySpaces(e.target.value)
        ? e.target.value.trim()
        : e.target.value,
    });
  };

  const handleLocationBlur = e => {
    // force redux state to register a change
    onChange({ searchString: ' ' });
    handleQueryChange(e);
  };

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

    onSubmit();
  };

  const handleGeolocationButtonClick = e => {
    e.preventDefault();
    recordEvent({
      event: 'fl-get-geolocation',
    });
    geolocateUser();
  };

  const handleClearInput = () => {
    clearSearchText();
    // optional chaining not allowed
    if (locationInputFieldRef.current) {
      locationInputFieldRef.current.value = '';
    }
    focusElement('#street-city-state-zip');
  };

  const renderLocationInputField = () => {
    if (facilitiesUseAddressTypeahead) {
      return (
        <AddressAutosuggest
          currentQuery={currentQuery}
          geolocateUser={geolocateUser}
          inputRef={locationInputFieldRef}
          isMobile={isMobile}
          isSmallDesktop={isSmallDesktop}
          isTablet={isTablet}
          onClearClick={handleClearInput}
          onChange={onChange}
          useProgressiveDisclosure={useProgressiveDisclosure}
        />
      );
    }
    const {
      locationChanged,
      searchString,
      geolocationInProgress,
    } = currentQuery;
    const showError =
      locationChanged &&
      !geolocationInProgress &&
      (!searchString || searchString.length === 0);
    return (
      <div
        id="location-input-container"
        className={classNames('vads-u-margin--0', {
          'usa-input-error': showError,
        })}
      >
        {/* 
        after the flipper useProgressiveDisclosure is removed,
        this id can be changed back to #location-input-field
        and the media query in it may be removed
         */}
        <div
          id={`location-input-field${
            useProgressiveDisclosure && isSmallDesktop ? '-desktop' : ''
          }`}
        >
          <label
            htmlFor="street-city-state-zip"
            id="street-city-state-zip-label"
          >
            <span id="city-state-zip-text">
              {useProgressiveDisclosure
                ? 'Zip code or city, state'
                : 'City, state or postal code'}
            </span>{' '}
            <span className="form-required-span">(*Required)</span>
          </label>
          {geolocationInProgress ? (
            <div
              className={`use-my-location-link ${
                isSmallDesktop && useProgressiveDisclosure
                  ? 'fl-sm-desktop'
                  : ''
              }`}
            >
              <va-icon icon="autorenew" size={3} />
              <span aria-live="assertive">Finding your location...</span>
            </div>
          ) : (
            <button
              onClick={handleGeolocationButtonClick}
              type="button"
              className={`use-my-location-link${
                isSmallDesktop && useProgressiveDisclosure ? '-desktop' : ''
              }`}
              aria-describedby="city-state-zip-text"
            >
              <va-icon icon="near_me" size={3} />
              Use my location
            </button>
          )}
        </div>
        {showError && (
          <span className="usa-input-error-message" role="alert">
            <span className="sr-only">Error</span>
            {useProgressiveDisclosure
              ? 'Enter a zip code or a city and state in the search box'
              : 'Please fill in a city, state, or postal code.'}
          </span>
        )}
        <div className="input-container">
          <input
            id="street-city-state-zip"
            ref={locationInputFieldRef}
            name="street-city-state-zip"
            type="text"
            onChange={handleQueryChange}
            onBlur={handleLocationBlur}
            value={searchString}
            title={
              useProgressiveDisclosure
                ? undefined // cause to be unset
                : 'Your location: Street, City, State or Postal code'
            }
          />
          {searchString?.length > 0 && (
            // eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component
            <button
              aria-label={
                useProgressiveDisclosure
                  ? 'Clear your zip code or city, state'
                  : 'Clear your city, state or postal code'
              }
              type="button"
              id="clear-input"
              className="clear-button"
              onClick={handleClearInput}
            >
              <va-icon icon="cancel" size={3} />
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderFacilityTypeDropdown = () => {
    const { suppressPPMS } = props;
    const { facilityType, isValid, facilityTypeChanged } = currentQuery;
    const locationOptions = suppressPPMS
      ? nonPPMSfacilityTypeOptions
      : facilityTypesOptions;
    const showError = !isValid && facilityTypeChanged && !facilityType;

    if (suppressPPMS) {
      delete locationOptions.pharmacy;
    }

    const options = Object.keys(locationOptions).map(facility => (
      <option key={facility} value={facility}>
        {locationOptions[facility]}
      </option>
    ));

    return (
      <div
        className={classNames(
          'input-clear',
          `facility-type-dropdown-val-${facilityType || 'none'}`,
          {
            'facility-type-dropdown': !useProgressiveDisclosure,
            'facility-type-dropdown-mobile':
              isMobile && useProgressiveDisclosure,
            'facility-type-dropdown-tablet':
              isTablet && useProgressiveDisclosure,
            'facility-type-dropdown-desktop':
              isSmallDesktop && useProgressiveDisclosure,
            'facility-error': showError,
          },
        )}
      >
        <VaSelect
          key={showError ? 'select-with-error' : 'select-without-error'}
          required
          id="facility-type-dropdown"
          className={
            showError
              ? `vads-u-padding-left--1p5 vads-u-padding-top--1p5`
              : null
          }
          label="Facility Type"
          value={facilityType || ''}
          onVaSelect={e => handleFacilityTypeChange(e)}
          error={showError ? 'Please choose a facility type.' : null}
        >
          {options}
        </VaSelect>
      </div>
    );
  };

  const renderServiceTypeDropdown = () => {
    const { facilityType, serviceType, serviceTypeChanged } = currentQuery;
    const disabled = ![
      LocationType.HEALTH,
      LocationType.URGENT_CARE,
      LocationType.CC_PROVIDER,
      LocationType.EMERGENCY_CARE,
    ].includes(facilityType);

    const showError = serviceTypeChanged && !disabled && !serviceType;
    const filteredHealthServices = healthServices;

    let services;
    // Determine what service types to display for the location type (if any).
    switch (facilityType) {
      case LocationType.HEALTH:
        services = filteredHealthServices;
        break;
      case LocationType.URGENT_CARE:
        services = urgentCareServices;
        break;
      case LocationType.EMERGENCY_CARE:
        services = emergencyCareServices;
        break;
      case LocationType.BENEFITS:
        if (useProgressiveDisclosure) {
          return null;
        }
        services = benefitsServices;
        break;
      case LocationType.CC_PROVIDER:
        if (useProgressiveDisclosure) {
          return (
            <ServicesLoadingOrShow
              currentQuery={currentQuery}
              serviceType="ppms_services"
              getProviderSpecialties={getProviderSpecialties}
            >
              <div
                id="service-typeahead-container"
                className={isMobile ? 'typeahead-mobile' : 'typeahead-tablet'}
              >
                <CCServiceTypeAhead
                  key="prog-disc-service-type-ahead"
                  getProviderSpecialties={getProviderSpecialties}
                  handleServiceTypeChange={handleServiceTypeChange}
                  initialSelectedServiceType={serviceType}
                  isSmallDesktop={isSmallDesktop}
                  showError={showError}
                  useProgressiveDisclosure
                />
              </div>
            </ServicesLoadingOrShow>
          );
        }
        return (
          <div
            className={classNames('typeahead', {
              'typeahead-mobile': isMobile,
              'typeahead-tablet':
                isTablet || (isSmallDesktop && !useProgressiveDisclosure),
              'typeahead-desktop': isSmallDesktop && useProgressiveDisclosure,
            })}
          >
            <CCServiceTypeAhead
              key="prog-disc-service-type-ahead"
              getProviderSpecialties={getProviderSpecialties}
              handleServiceTypeChange={handleServiceTypeChange}
              initialSelectedServiceType={serviceType}
              isSmallDesktop={isSmallDesktop}
              showError={showError}
              useProgressiveDisclosure={useProgressiveDisclosure}
            />
          </div>
        );
      default:
        if (useProgressiveDisclosure) {
          return null; // do not show a disabled dropdown for progressive disclosure
        }
        services = {};
    }

    // Create option elements for each VA service type.
    const options = Object.keys(services).map(service => (
      <option key={service} value={service} style={{ fontWeight: 'bold' }}>
        {services[service]}
      </option>
    ));

    return (
      <div
        className={classNames({
          'service-type-dropdown-mobile': isMobile,
          'service-type-dropdown-tablet':
            isTablet || (isSmallDesktop && !useProgressiveDisclosure),
          'service-type-dropdown-desktop':
            isSmallDesktop && useProgressiveDisclosure,
        })}
      >
        <label htmlFor="service-type-dropdown">Service type</label>
        <select
          id="service-type-dropdown"
          disabled={disabled || !facilityType}
          value={serviceType || ''}
          onChange={handleServiceTypeChange}
        >
          {options}
        </select>
      </div>
    );
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
            ? 'We need to use your location'
            : "We couldn't locate you"
        }
        onCloseEvent={() => clearGeocodeError()}
        status="warning"
        visible={currentQuery.geocodeError > 0}
      >
        <p>
          {currentQuery.geocodeError === 1
            ? 'Please enable location sharing in your browser to use this feature.'
            : 'Sorry, something went wrong when trying to find your location. Please make sure location sharing is enabled and try again.'}
        </p>
      </VaModal>
      <form id="facility-search-controls" onSubmit={handleSubmit}>
        {renderLocationInputField()}
        {useProgressiveDisclosure ? (
          <>
            {renderFacilityTypeDropdown()}
            {renderServiceTypeDropdown()}
            <va-button
              id="facility-search"
              submit="prevent"
              text="Search"
              class="vads-u-width--full"
            />
          </>
        ) : (
          <BottomRow isSmallDesktop={isSmallDesktop}>
            {renderFacilityTypeDropdown()}
            {renderServiceTypeDropdown()}
            <div>
              <input id="facility-search" type="submit" value="Search" />
            </div>
          </BottomRow>
        )}
      </form>
    </div>
  );
};

SearchForm.propTypes = SearchFormTypes;

export default SearchForm;
