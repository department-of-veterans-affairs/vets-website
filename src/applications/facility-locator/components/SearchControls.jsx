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

    const { facilityType, serviceType, zoomLevel } = this.props.currentQuery;

    let analyticsServiceType = serviceType;

    if (facilityType === LocationType.CC_PROVIDER) {
      if (!serviceType) {
        focusElement('#service-type-ahead-input');

        return;
      }

      analyticsServiceType = this.props.currentQuery.specialties[serviceType];
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

  renderLocationInputField = currentQuery => (
    <>
      <label htmlFor="street-city-state-zip" id="street-city-state-zip-label">
        City, state or postal code{' '}
        <span className="vads-u-color--secondary-dark">(*Required)</span>
      </label>
      <input
        id="street-city-state-zip"
        name="street-city-state-zip"
        style={{ fontWeight: 'bold' }}
        type="text"
        onChange={this.handleQueryChange}
        value={currentQuery.searchString}
        title="Your location: Street, City, State or Postal code"
        required
      />
    </>
  );

  renderFacilityTypeDropdown = () => {
    const { suppressCCP, suppressPharmacies } = this.props;
    const { facilityType } = this.props.currentQuery;
    const locationOptions = facilityTypesOptions;
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
      <span>
        <label htmlFor="facility-type-dropdown">
          Facility type{' '}
          <span className="vads-u-color--secondary-dark">(*Required)</span>
        </label>
        <select
          id="facility-type-dropdown"
          aria-label="Choose a facility type"
          value={facilityType || ''}
          className="bor-rad"
          onChange={this.handleFacilityTypeChange}
          style={{ fontWeight: 'bold' }}
          required
        >
          {options}
        </select>
      </span>
    );
  };

  renderServiceTypeDropdown = () => {
    const { searchCovid19Vaccine } = this.props;
    const { facilityType, serviceType } = this.props.currentQuery;
    const disabled = ![
      LocationType.HEALTH,
      LocationType.URGENT_CARE,
      LocationType.BENEFITS,
      LocationType.CC_PROVIDER,
    ].includes(facilityType);

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
