import React, { useEffect, useRef } from 'react';
import ServiceTypeAhead from './ServiceTypeAhead';
import recordEvent from 'platform/monitoring/record-event';
import omit from 'platform/utilities/data/omit';
import { LocationType } from '../constants';
import {
  healthServices,
  benefitsServices,
  urgentCareServices,
  facilityTypesOptions,
} from '../config';
import { focusElement } from 'platform/utilities/ui';
import classNames from 'classnames';
import Modal from '@department-of-veterans-affairs/component-library/Modal';
import { setFocus } from '../utils/helpers';

const SearchControls = props => {
  const {
    currentQuery,
    onChange,
    onSubmit,
    clearSearchText,
    geolocateUser,
    clearGeocodeError,
  } = props;

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
    onChange({ facilityType: e.target.value, serviceType: null });
  };

  const handleFacilityTypeBlur = e => {
    // force redux state to register a change
    onChange({ facilityType: ' ' });
    handleFacilityTypeChange(e);
  };

  const handleServiceTypeChange = ({ target }) => {
    const option = target.value.trim();

    const serviceType = option === 'All' ? null : option;
    onChange({ serviceType });
  };

  const handleServiceTypeBlur = e => {
    // force redux state to register a change
    onChange({ serviceType: ' ' });
    handleServiceTypeChange(e);
  };

  const handleSubmit = e => {
    e.preventDefault();

    const {
      facilityType,
      serviceType,
      zoomLevel,
      isValid,
      searchString,
    } = currentQuery;

    let analyticsServiceType = serviceType;

    const updateReduxState = propName => {
      onChange({ [propName]: ' ' });
      onChange({ [propName]: '' });
    };

    if (facilityType === LocationType.CC_PROVIDER) {
      if (!serviceType) {
        updateReduxState('serviceType');
        focusElement('#service-type-ahead-input');
        return;
      }

      analyticsServiceType = currentQuery.specialties[serviceType];
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
    focusElement('#street-city-state-zip');
  };

  const renderLocationInputField = () => {
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
        className={classNames('vads-u-margin--0', {
          'usa-input-error': showError,
        })}
      >
        <div id="location-input-field">
          <label
            htmlFor="street-city-state-zip"
            id="street-city-state-zip-label"
          >
            City, state or postal code{' '}
            <span className="form-required-span">(*Required)</span>
          </label>
          {geolocationInProgress ? (
            <div className="use-my-location-link">
              <i
                className="fa fa-spinner fa-spin"
                aria-hidden="true"
                role="presentation"
              />
              <span aria-live="assertive">Finding your location...</span>
            </div>
          ) : (
            <button
              onClick={handleGeolocationButtonClick}
              type="button"
              className="use-my-location-link"
            >
              <i
                className="use-my-location-button"
                aria-hidden="true"
                role="presentation"
              />
              Use my location
            </button>
          )}
        </div>
        {showError && (
          <span className="usa-input-error-message" role="alert">
            <span className="sr-only">Error</span>
            Please fill in a city, state, or postal code.
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
            title="Your location: Street, City, State or Postal code"
          />
          {searchString?.length > 0 && (
            <button
              aria-label="Clear your city, state or postal code"
              type="button"
              id="clear-input"
              className="fas fa-times-circle clear-button"
              onClick={handleClearInput}
            />
          )}
        </div>
      </div>
    );
  };

  const renderFacilityTypeDropdown = () => {
    const { suppressCCP, suppressPharmacies } = props;
    const { facilityType, isValid, facilityTypeChanged } = currentQuery;
    const locationOptions = facilityTypesOptions;
    const showError = !isValid && facilityTypeChanged && !facilityType;

    if (suppressPharmacies) {
      delete locationOptions.pharmacy;
    }

    if (suppressCCP) {
      delete locationOptions.provider;
    }

    const options = Object.keys(locationOptions).map(facility => (
      <option key={facility} value={facility}>
        {locationOptions[facility]}
      </option>
    ));

    return (
      <div
        className={classNames('input-clear', 'vads-u-margin--0', {
          'usa-input-error': showError,
        })}
      >
        <label htmlFor="facility-type-dropdown">
          Facility type <span className="form-required-span">(*Required)</span>
        </label>
        {showError && (
          <span className="usa-input-error-message" role="alert">
            <span className="sr-only">Error</span>
            Please choose a facility type.
          </span>
        )}
        <select
          id="facility-type-dropdown"
          aria-label="Choose a facility type"
          value={facilityType || ''}
          className="bor-rad"
          onChange={handleFacilityTypeChange}
          onBlur={handleFacilityTypeBlur}
          style={{ fontWeight: 'bold' }}
        >
          {options}
        </select>
      </div>
    );
  };

  const renderServiceTypeDropdown = () => {
    const { searchCovid19Vaccine } = props;
    const { facilityType, serviceType, serviceTypeChanged } = currentQuery;
    const disabled = ![
      LocationType.HEALTH,
      LocationType.URGENT_CARE,
      LocationType.BENEFITS,
      LocationType.CC_PROVIDER,
    ].includes(facilityType);

    const showError = serviceTypeChanged && !disabled && !serviceType;

    let filteredHealthServices = healthServices;

    if (!searchCovid19Vaccine) {
      filteredHealthServices = omit(['Covid19Vaccine'], healthServices);
    }

    let services;
    // Determine what service types to display for the location type (if any).
    switch (facilityType) {
      case LocationType.HEALTH:
        services = filteredHealthServices;
        break;
      case LocationType.URGENT_CARE:
        services = urgentCareServices;
        break;
      case LocationType.BENEFITS:
        services = benefitsServices;
        break;
      case LocationType.CC_PROVIDER:
        return (
          <ServiceTypeAhead
            onSelect={handleServiceTypeChange}
            onBlur={handleServiceTypeBlur}
            initialSelectedServiceType={serviceType}
            showError={showError}
          />
        );
      default:
        services = {};
    }

    // Create option elements for each VA service type.
    const options = Object.keys(services).map(service => (
      <option key={service} value={service} style={{ fontWeight: 'bold' }}>
        {services[service]}
      </option>
    ));

    return (
      <span>
        <label htmlFor="service-type-dropdown">Service type</label>
        <select
          id="service-type-dropdown"
          disabled={disabled || !facilityType}
          value={serviceType || ''}
          className="bor-rad"
          onChange={handleServiceTypeChange}
          style={{ fontWeight: 'bold' }}
        >
          {options}
        </select>
      </span>
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
    },
    [currentQuery.geocodeError],
  );

  return (
    <div className="search-controls-container clearfix">
      <Modal
        title={
          currentQuery.geocodeError === 1
            ? 'We need to use your location'
            : "We couldn't locate you"
        }
        onClose={() => clearGeocodeError()}
        status="warning"
        visible={currentQuery.geocodeError > 0}
        contents={
          <>
            <p>
              {currentQuery.geocodeError === 1
                ? 'Please enable location sharing in your browser to use this feature.'
                : 'Sorry, something went wrong when trying to find your location. Please make sure location sharing is enabled and try again.'}
            </p>
          </>
        }
      />
      <form id="facility-search-controls" onSubmit={handleSubmit}>
        <div className={'columns'}>
          {renderLocationInputField()}
          <div id="search-controls-bottom-row">
            {renderFacilityTypeDropdown()}
            {renderServiceTypeDropdown()}
            <input id="facility-search" type="submit" value="Search" />
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchControls;
