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
  handleQueryChange = e => {
    this.props.onChange({ searchString: e.target.value });
  };

  handleFacilityTypeChange = e => {
    this.props.onChange({ facilityType: e.target.value, serviceType: null });
  };

  handleServiceTypeChange = ({ target }) => {
    const option = target.value;

    const serviceType = option === 'All' ? null : option;
    this.props.onChange({ serviceType });
  };

  handleSubmit = e => {
    e.preventDefault();

    const {
      facilityType,
      serviceType,
      zoomLevel,
      isValid,
    } = this.props.currentQuery;

    let analyticsServiceType = serviceType;

    if (facilityType === LocationType.CC_PROVIDER) {
      if (!serviceType) {
        focusElement('#service-type-ahead-input');

        return;
      }

      analyticsServiceType = this.props.currentQuery.specialties[serviceType];
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

  renderClearInput = () => {
    if (window.Cypress || !environment.isProduction()) {
      return (
        <button
          aria-label="Clear your city, state or postal code"
          type="button"
          id="clear-input"
          className="fas fa-times-circle clear-button"
          onClick={this.handleClearInput}
        />
      );
    }
    return null;
  };

  renderLocationInputField = currentQuery => {
    const showError =
      !currentQuery.isValid && currentQuery.searchString?.length === 0;
    return (
      <div
        className={classNames('input-clear', 'vads-u-margin--0', {
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
            (currentQuery.geocodeInProgress ? (
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
            Please fill in a city, state, or postal code.
          </span>
        )}
        <input
          id="street-city-state-zip"
          name="street-city-state-zip"
          type="text"
          onChange={this.handleQueryChange}
          value={currentQuery.searchString}
          title="Your location: Street, City, State or Postal code"
        />
        {currentQuery?.searchString?.length > 0 && this.renderClearInput()}
      </div>
    );
  };

  renderFacilityTypeDropdown = () => {
    const { suppressCCP, suppressPharmacies } = this.props;
    const { facilityType, isValid } = this.props.currentQuery;
    const locationOptions = facilityTypesOptions;
    const showError = !isValid && !facilityType;

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
            Please choose a facility type.
          </span>
        )}
        <select
          id="facility-type-dropdown"
          aria-label="Choose a facility type"
          value={facilityType || ''}
          className="bor-rad"
          onChange={this.handleFacilityTypeChange}
          style={{ fontWeight: 'bold' }}
        >
          {options}
        </select>
      </div>
    );
  };

  renderServiceTypeDropdown = () => {
    const { searchCovid19Vaccine } = this.props;
    const { facilityType, serviceType, isValid } = this.props.currentQuery;
    const disabled = ![
      LocationType.HEALTH,
      LocationType.URGENT_CARE,
      LocationType.BENEFITS,
      LocationType.CC_PROVIDER,
    ].includes(facilityType);

    const showError = !isValid && !disabled && !serviceType;

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
