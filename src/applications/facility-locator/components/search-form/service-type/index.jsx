import React from 'react';
import PropTypes from 'prop-types';
import { LocationType } from '../../../constants';
import CCServiceTypeAhead from './CCServiceTypeAhead';
import {
  benefitsServices,
  healthServices,
  urgentCareServices,
  emergencyCareServices,
} from '../../../config';
import { CurrentQueryTypes } from '../../../types';
import VAMCServiceAutosuggest from './VAMCServiceAutosuggest';

const ServiceType = ({
  currentQuery,
  handleServiceTypeChange,
  selectedServiceType,
  vamcAutoSuggestEnabled,
}) => {
  const { facilityType, serviceType, serviceTypeChanged } = currentQuery;

  // VAMC Services Autosuggest feature
  if (facilityType === LocationType.HEALTH && vamcAutoSuggestEnabled) {
    return (
      <VAMCServiceAutosuggest
        handleServiceTypeChange={handleServiceTypeChange}
        selectedServiceType={selectedServiceType}
      />
    );
  }

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

ServiceType.propTypes = {
  currentQuery: CurrentQueryTypes,
  handleServiceTypeChange: PropTypes.func,
  selectedServiceType: PropTypes.string,
  vamcAutoSuggestEnabled: PropTypes.bool,
};

export default ServiceType;
