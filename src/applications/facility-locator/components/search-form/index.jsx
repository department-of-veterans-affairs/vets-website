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
import CCServiceTypeAhead from './service-type/CCServiceTypeAhead';
import { setFocus } from '../../utils/helpers';
import { SearchFormTypes } from '../../types';
import AddressAutosuggest from './location/AddressAutosuggest';

const SearchForm = props => {
  const {
    clearGeocodeError,
    clearSearchText,
    currentQuery,
    facilitiesUseAddressTypeahead,
    geolocateUser,
    isMobile,
    mobileMapUpdateEnabled,
    onChange,
    onSubmit,
    selectMobileMapPin,
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
          geolocateUser={geolocateUser}
          inputRef={locationInputFieldRef}
          onClearClick={handleClearInput}
          onChange={onChange}
          currentQuery={currentQuery}
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
        className={classNames('vads-u-margin--0', {
          'usa-input-error': showError,
        })}
      >
        <div id="location-input-field">
          <label
            htmlFor="street-city-state-zip"
            id="street-city-state-zip-label"
          >
            <span id="city-state-zip-text">City, state or postal code</span>{' '}
            <span className="form-required-span">(*Required)</span>
          </label>
          {geolocationInProgress ? (
            <div className="use-my-location-link">
              <va-icon icon="autorenew" size={3} />
              <span aria-live="assertive">Finding your location...</span>
            </div>
          ) : (
            <button
              onClick={handleGeolocationButtonClick}
              type="button"
              className="use-my-location-link"
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
          'vads-u-margin--0',
          `facility-type-dropdown-val-${facilityType || 'none'}`,
        )}
      >
        <VaSelect
          uswds
          required
          id="facility-type-dropdown"
          className={showError ? 'vads-u-padding-left--1p5' : null}
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
        services = benefitsServices;
        break;
      case LocationType.CC_PROVIDER:
        return (
          <div className="typeahead">
            <CCServiceTypeAhead
              handleServiceTypeChange={handleServiceTypeChange}
              initialSelectedServiceType={serviceType}
              showError={showError}
            />
          </div>
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
      <span className="service-type-dropdown-container">
        <label htmlFor="service-type-dropdown">Service type</label>
        <select
          id="service-type-dropdown"
          disabled={disabled || !facilityType}
          value={serviceType || ''}
          onChange={handleServiceTypeChange}
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
    <div className="search-controls-container clearfix">
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
      <form
        className="vads-u-margin-bottom--0"
        id="facility-search-controls"
        onSubmit={handleSubmit}
      >
        <div className="columns">
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

SearchForm.propTypes = SearchFormTypes;

export default SearchForm;
