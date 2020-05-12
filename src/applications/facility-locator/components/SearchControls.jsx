import React, { Component } from 'react';
import ServiceTypeAhead from './ServiceTypeAhead';
import recordEvent from 'platform/monitoring/record-event';
import { LocationType } from '../constants';
import {
  healthServices,
  benefitsServices,
  vetCenterServices,
  urgentCareServices,
  facilityTypesOptions,
} from '../config';
import { focusElement } from 'platform/utilities/ui';

class SearchControls extends Component {
  handleEditSearch = () => {
    this.props.onChange({ active: false });
  };

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

    const { facilityType, serviceType } = this.props.currentQuery;

    if (facilityType === LocationType.CC_PROVIDER && !serviceType) {
      focusElement('#service-type-ahead-input');
      return;
    }

    // Report event here to only send analytics event when a user clicks on the button
    recordEvent({
      event: 'fl-search',
      'fl-search-fac-type': facilityType,
    });

    this.props.onSubmit();
  };

  renderFacilityTypeDropdown = () => {
    const { showCommunityCares } = this.props;
    const locationOptions = facilityTypesOptions;
    if (!showCommunityCares) {
      delete locationOptions.cc_provider;
    }
    const options = Object.keys(locationOptions).map(facility => (
      <option key={facility} value={facility}>
        {locationOptions[facility]}
      </option>
    ));
    return (
      <span>
        <label htmlFor="facility-type-dropdown">
          Choose a VA facility type
        </label>
        <select
          id="facility-type-dropdown"
          aria-label="Choose a service type"
          className="bor-rad"
          onChange={this.handleFacilityTypeChange}
          style={{ fontWeight: 'bold' }}
        >
          {options}
        </select>
      </span>
    );
  };

  renderServiceTypeDropdown = () => {
    const { facilityType, serviceType } = this.props.currentQuery;
    const disabled = ![
      LocationType.HEALTH,
      LocationType.URGENT_CARE,
      LocationType.BENEFITS,
      LocationType.VET_CENTER,
      LocationType.CC_PROVIDER,
    ].includes(facilityType);

    let services;
    // Determine what service types to display for the location type (if any).
    switch (facilityType) {
      case LocationType.HEALTH:
        services = healthServices;
        break;
      case LocationType.URGENT_CARE:
        services = urgentCareServices;
        break;
      case LocationType.BENEFITS:
        services = benefitsServices;
        break;
      case LocationType.VET_CENTER:
        services = vetCenterServices.reduce(result => result, {
          All: 'Show all facilities',
        });
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
        <label htmlFor="service-type-dropdown">Choose a service type</label>
        <select
          id="service-type-dropdown"
          disabled={disabled}
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
    const { currentQuery, isMobile } = this.props;

    if (currentQuery.active && isMobile) {
      return (
        <div className="search-controls-container">
          <button className="small-12" onClick={this.handleEditSearch}>
            Edit Search
          </button>
        </div>
      );
    }

    return (
      <div className="search-controls-container clearfix">
        <form id="facility-search-controls" onSubmit={this.handleSubmit}>
          <div className="row">
            <div className={isMobile ? 'columns' : 'columns marg-left'}>
              <div className="row">
                <div className="columns large-1-2">
                  <label
                    htmlFor="street-city-state-zip"
                    id="street-city-state-zip-label"
                  >
                    Search by city, state or postal Code
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
                </div>
              </div>
              <div className="row">
                <div className="columns large-1-2">
                  {this.renderFacilityTypeDropdown()}
                </div>
                <div className="columns large-1-2">
                  {this.renderServiceTypeDropdown()}
                </div>
                <div className="columns medium-1-2">
                  <input type="submit" value="Search" />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default SearchControls;
