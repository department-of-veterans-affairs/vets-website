import React, { Component } from 'react';
import FacilityTypeDropdown from './FacilityTypeDropdown';
import ServiceTypeAhead from './ServiceTypeAhead';
import recordEvent from '../../../platform/monitoring/record-event';
import { LocationType } from '../constants';
import { healthServices, benefitsServices, vetCenterServices } from '../config';

class SearchControls extends Component {
  handleEditSearch = () => {
    this.props.onChange({ active: false });
  };

  // eslint-disable-next-line prettier/prettier
  handleQueryChange = (e) => {
    this.props.onChange({ searchString: e.target.value });
  };

  // eslint-disable-next-line prettier/prettier
  handleFacilityTypeChange = (option) => {
    this.props.onChange({ facilityType: option, serviceType: null });
  };

  handleServiceTypeChange = ({ target }) => {
    const option = target.value;
    // eslint-disable-next-line prettier/prettier
    const serviceType = (option === 'All') ? null : option;
    this.props.onChange({ serviceType });
  };

  handleSubmit = e => {
    e.preventDefault();

    const { facilityType } = this.props.currentQuery;
    // Report event here to only send analytics event when a user clicks on the button
    recordEvent({
      event: 'fl-search',
      'fl-search-fac-type': facilityType,
    });

    this.props.onSubmit();
  };

  renderServiceTypeDropdown = () => {
    const { facilityType, serviceType } = this.props.currentQuery;
    const disabled = ![
      LocationType.HEALTH,
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
      case LocationType.BENEFITS:
        services = benefitsServices;
        break;
      case LocationType.VET_CENTER:
        services = vetCenterServices.reduce(
          (result, service) => {
            result[service] = service; // eslint-disable-line no-param-reassign
            return result;
          },
          { All: 'Show all facilities' },
        );
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
      <option key={service} value={service}>
        {services[service]}
      </option>
    ));

    return (
      <span>
        <label htmlFor="service-type-dropdown">Service type (optional)</label>
        <select
          id="service-type-dropdown"
          disabled={disabled}
          value={serviceType || ''}
          onChange={this.handleServiceTypeChange}
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
        <form
          id="facility-search-controls"
          className="row"
          onSubmit={this.handleSubmit}
        >
          <div className="columns medium-3-5">
            <label
              htmlFor="street-city-state-zip"
              id="street-city-state-zip-label"
            >
              Search city, state, or postal code
            </label>
            <input
              id="street-city-state-zip"
              name="street-city-state-zip"
              type="text"
              onChange={this.handleQueryChange}
              value={currentQuery.searchString}
              title="Your location: Street, City, State or Zip"
            />
          </div>
          <div className="columns medium-3-5">
            <FacilityTypeDropdown
              facilityType={this.props.currentQuery.facilityType}
              onChange={this.handleFacilityTypeChange}
            />
          </div>
          <div className="columns medium-3-4">
            {this.renderServiceTypeDropdown()}
          </div>
          <div className="columns medium-1-2">
            <input type="submit" value="Search" />
          </div>
        </form>
      </div>
    );
  }
}

export default SearchControls;
