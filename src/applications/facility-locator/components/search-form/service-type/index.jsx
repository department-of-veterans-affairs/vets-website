import React from 'react';
import classNames from 'classnames';
import { LocationType } from '../../../constants';
import CCServiceTypeAhead from './CCServiceTypeAhead';
import {
  benefitsServices,
  healthServices,
  urgentCareServices,
  emergencyCareServices,
} from '../../../config';
import { ServiceTypeInputTypes } from '../../../types';
import ServicesLoadingOrShow from './ServicesLoadingOrShow';
import VAMCServiceAutosuggest from './VAMCServiceAutosuggest';

const ServiceType = ({
  currentQuery,
  getProviderSpecialties,
  handleServiceTypeChange,
  isMobile,
  isSmallDesktop,
  isTablet,
  onChange,
  searchInitiated,
  setSearchInitiated,
  useProgressiveDisclosure,
  vamcAutoSuggestEnabled,
}) => {
  const { facilityType, serviceType, serviceTypeChanged } = currentQuery;

  // VAMC Services Autosuggest feature
  if (facilityType === LocationType.HEALTH && vamcAutoSuggestEnabled) {
    return (
      <VAMCServiceAutosuggest
        onChange={onChange}
        searchInitiated={searchInitiated}
        setSearchInitiated={setSearchInitiated}
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
      if (useProgressiveDisclosure) {
        return null;
      }
      services = benefitsServices;
      break;
    case LocationType.CC_PROVIDER:
      if (useProgressiveDisclosure) {
        return (
          <ServicesLoadingOrShow
            serviceType="ppms_services"
            getProviderSpecialties={getProviderSpecialties}
          >
            <div
              id="service-typeahead-container"
              className={isMobile ? 'typeahead-mobile' : 'typeahead-tablet'}
              data-testid="cc-service-typeahead-pd"
            >
              <CCServiceTypeAhead
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
          data-testid="cc-service-typeahead"
        >
          <CCServiceTypeAhead
            handleServiceTypeChange={handleServiceTypeChange}
            initialSelectedServiceType={serviceType}
            isSmallDesktop={isSmallDesktop}
            showError={showError}
            useProgressiveDisclosure={false}
            getProviderSpecialties={getProviderSpecialties}
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
      data-testid={disabled ? 'disabled-service-type-dropdown' : 'service-type'}
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

ServiceType.propTypes = ServiceTypeInputTypes;

export default ServiceType;
