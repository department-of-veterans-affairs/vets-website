import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import {
  facilityTypes,
  urgentCareServices,
  healthServices,
  benefitsServices,
  emergencyCareServices,
} from '../config';
import {
  LocationType,
  facilityHasUnpaginatedResults as areFacilityTypeResultsUnpaginated,
  hasNoServices as determineFacilityTypeHasNoServices,
  isPluralizedFacilityType,
} from '../constants';
import { PaginationTypes } from '../types';

export const SearchResultsHeader = ({
  context,
  facilityType,
  inProgress,
  pagination,
  results,
  radius,
  serviceType,
  specialtyMap,
  vamcServiceDisplay,
}) => {
  if (inProgress || !context) {
    return <div style={{ height: '38px' }} />;
  }

  const noResultsFound = !results || !results.length;
  const location = context ? context.replace(', United States', '') : null;
  const resultsAreUnpaginated = areFacilityTypeResultsUnpaginated(facilityType);

  const facilityTypeHasNoServices = determineFacilityTypeHasNoServices(
    facilityType,
  );

  const facilityTypeIsPluralized = isPluralizedFacilityType(facilityType);

  const servicesByFacility = {
    [LocationType.URGENT_CARE]: {
      services: urgentCareServices,
      allServicesKey: 'AllUrgentCare',
    },
    [LocationType.EMERGENCY_CARE]: {
      services: emergencyCareServices,
      allServicesKey: 'AllEmergencyCare',
    },
    [LocationType.HEALTH]: { services: healthServices, allServicesKey: 'All' },
    [LocationType.CC_PROVIDER]: { services: specialtyMap },
    [LocationType.BENEFITS]: {
      services: benefitsServices,
      allServicesKey: 'All',
    },
  };

  const formatServiceType = rawServiceType => {
    if (facilityType === LocationType.HEALTH && vamcServiceDisplay) {
      return vamcServiceDisplay;
    }

    const config = servicesByFacility[facilityType];
    if (!config?.services) return rawServiceType;
    if (rawServiceType) return config.services[rawServiceType];
    return config.allServicesKey
      ? config.services[config.allServicesKey]
      : rawServiceType;
  };

  const determinePrefixText = () => {
    if (noResultsFound) {
      return 'No results found for ';
    }
    if (resultsAreUnpaginated) {
      return 'Results for ';
    }

    if (pagination && !resultsAreUnpaginated) {
      const { totalEntries, currentPage, totalPages } = pagination;

      if (totalEntries === 1) {
        return 'Showing 1 result for ';
      }
      if (totalEntries <= 10) {
        return `Showing 1 - ${totalEntries} results for `;
      }
      if (totalEntries > 10) {
        const start = 10 * (currentPage - 1) + 1;
        const end =
          currentPage !== totalPages ? 10 * currentPage : totalEntries;
        return `Showing ${start} - ${end} of ${totalEntries} results for `;
      }
      return 'Results for ';
    }
    return 'Results for ';
  };

  const formattedServiceTypeText = formatServiceType(serviceType);
  const serviceNameContainsServicesWord =
    formattedServiceTypeText?.includes('services') || false;

  const determineServicesText = () => {
    const serviceDisplay = {
      serviceTypeText: '',
      showServicesWord: false,
    };

    if (facilityTypeHasNoServices) {
      return serviceDisplay;
    }

    if (serviceNameContainsServicesWord) {
      serviceDisplay.serviceTypeText = formattedServiceTypeText.replace(
        'services',
        '',
      );
      serviceDisplay.showServicesWord = true;
      return serviceDisplay;
    }

    if (!serviceNameContainsServicesWord) {
      serviceDisplay.serviceTypeText = formattedServiceTypeText;
      serviceDisplay.showServicesWord = true;
      return serviceDisplay;
    }
    return serviceDisplay;
  };

  const facilityLabel = facilityTypes[facilityType] || '';

  return (
    <div>
      <h2
        id="search-results-subheader"
        className="vads-u-font-family--sans vads-u-font-weight--normal vads-u-font-size--base vads-u-padding--0p5 vads-u-margin-y--1"
        tabIndex="-1"
      >
        {determinePrefixText()}
        {!facilityTypeHasNoServices && (
          <>
            <b>{determineServicesText().serviceTypeText}</b>
            {determineServicesText().showServicesWord && ` services at `}
          </>
        )}
        {facilityLabel && (
          <>
            <b>{facilityLabel}</b>
            {!facilityTypeIsPluralized ? ` facilities` : ``}
          </>
        )}
        {location && (
          <>
            {radius != null
              ? ` within ${Math.round(radius)} miles of `
              : ` near `}
            <b>{`${location}`}</b>
          </>
        )}
      </h2>
    </div>
  );
};

SearchResultsHeader.propTypes = {
  context: PropTypes.string,
  facilityType: PropTypes.string,
  inProgress: PropTypes.bool,
  pagination: PaginationTypes,
  radius: PropTypes.number,
  results: PropTypes.array,
  serviceType: PropTypes.string,
  specialtyMap: PropTypes.object,
  vamcServiceDisplay: PropTypes.string,
};

// Only re-render if results or inProgress props have changed
const areEqual = (prevProps, nextProps) => {
  return (
    nextProps.results === prevProps.results &&
    nextProps.inProgress === prevProps.inProgress
  );
};

const mapStateToProps = state => ({
  specialtyMap: state.searchQuery.specialties,
  vamcServiceDisplay: state.searchQuery?.vamcServiceDisplay,
});

export default React.memo(
  connect(mapStateToProps)(SearchResultsHeader),
  areEqual,
);
