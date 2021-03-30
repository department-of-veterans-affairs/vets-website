import React, { Component } from 'react';
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
import environment from 'platform/utilities/environment';
import classNames from 'classnames';

class SearchControls extends Component {
  onlySpaces = str => /^\s+$/.test(str);

  handleQueryChange = e => {
    // prevent users from entering only spaces
    // because this will not trigger a change
    // when they exit the field
    this.props.onChange({
      searchString: this.onlySpaces(e.target.value)
        ? e.target.value.trim()
        : e.target.value,
    });
  };

  handleLocationBlur = e => {
    // force redux state to register a change
    this.props.onChange({ searchString: ' ' });
    this.handleQueryChange(e);
  };

  handleFacilityTypeChange = e => {
    this.props.onChange({ facilityType: e.target.value, serviceType: null });
  };

  handleFacilityTypeBlur = e => {
    // force redux state to register a change
    this.props.onChange({ facilityType: ' ' });
    this.handleFacilityTypeChange(e);
  };

  handleServiceTypeChange = ({ target }) => {
    const option = target.value.trim();

    const serviceType = option === 'All' ? null : option;
    this.props.onChange({ serviceType });
  };

  handleServiceTypeBlur = e => {
    // force redux state to register a change
    this.props.onChange({ serviceType: ' ' });
    this.handleServiceTypeChange(e);
  };

  handleSubmit = e => {
    e.preventDefault();

    const {
      facilityType,
      serviceType,
      zoomLevel,
      isValid,
      searchString,
    } = this.props.currentQuery;

    let analyticsServiceType = serviceType;

    const updateReduxState = propName => {
      this.props.onChange({ [propName]: ' ' });
      this.props.onChange({ [propName]: '' });
    };

    if (facilityType === LocationType.CC_PROVIDER) {
      if (!serviceType) {
        updateReduxState('serviceType');
        focusElement('#service-type-ahead-input');
        return;
      }

      analyticsServiceType = this.props.currentQuery.specialties[serviceType];
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

    this.props.onSubmit();
  };

  handleGeolocationButtonClick = e => {
    e.preventDefault();
    recordEvent({
      event: 'fl-search-geolocation',
    });
    this.props.geolocateUser();
  };

  handleClearInput = () => {
    this.props.clearSearchText();
    focusElement('#street-city-state-zip');
  };

  renderLocationInputField = currentQuery => {
    const { locationChanged, searchString, geocodeInProgress } = currentQuery;
    const showError =
      locationChanged && (!searchString || searchString.length === 0);
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
          {(window.Cypress || !environment.isProduction()) &&
            (geocodeInProgress ? (
              <div className="use-my-location-link">
                <i
                  className="fa fa-spinner fa-spin"
                  aria-hidden="true"
                  role="presentation"
                />
                <span>Finding your location...</span>
              </div>
            ) : (
              <a
                href="#"
                onClick={this.handleGeolocationButtonClick}
                className="use-my-location-link"
              >
                <i
                  className="use-my-location-button"
                  aria-hidden="true"
                  role="presentation"
                />
                Use my location
              </a>
            ))}
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
            name="street-city-state-zip"
            type="text"
            onChange={this.handleQueryChange}
            onBlur={this.handleLocationBlur}
            value={searchString}
            title="Your location: Street, City, State or Postal code"
          />
          {searchString?.length > 0 && (
            <button
              aria-label="Clear your city, state or postal code"
              type="button"
              id="clear-input"
              className="fas fa-times-circle clear-button"
              onClick={this.handleClearInput}
            />
          )}
        </div>
      </div>
    );
  };

  renderFacilityTypeDropdown = () => {
    const { suppressCCP, suppressPharmacies } = this.props;
    const {
      facilityType,
      isValid,
      facilityTypeChanged,
    } = this.props.currentQuery;
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
          onChange={this.handleFacilityTypeChange}
          onBlur={this.handleFacilityTypeBlur}
          style={{ fontWeight: 'bold' }}
        >
          {options}
        </select>
      </div>
    );
  };

  renderServiceTypeDropdown = () => {
    const { searchCovid19Vaccine } = this.props;
    const {
      facilityType,
      serviceType,
      serviceTypeChanged,
    } = this.props.currentQuery;
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
            onSelect={this.handleServiceTypeChange}
            onBlur={this.handleServiceTypeBlur}
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
          onChange={this.handleServiceTypeChange}
          style={{ fontWeight: 'bold' }}
        >
          {options}
        </select>
      </span>
    );
  };

  render() {
    const { currentQuery } = this.props;

    return (
      <div className="search-controls-container clearfix">
        <form id="facility-search-controls" onSubmit={this.handleSubmit}>
          <div className={'columns'}>
            {this.renderLocationInputField(currentQuery)}
            <div id="search-controls-bottom-row">
              {this.renderFacilityTypeDropdown()}
              {this.renderServiceTypeDropdown()}
              <input id="facility-search" type="submit" value="Search" />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default SearchControls;
