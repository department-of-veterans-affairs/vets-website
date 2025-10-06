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
import { LocationType } from '../constants';
import { PaginationTypes } from '../types';

export const SearchResultsHeader = ({
  context,
  facilityType,
  inProgress,
  pagination,
  results,
  serviceType,
  specialtyMap,
  vamcServiceDisplay,
}) => {
  const noResultsFound = !results || !results.length;

  if (inProgress || !context) {
    return <div style={{ height: '38px' }} />;
  }

  const location = context ? context.replace(', United States', '') : null;

  const formatServiceType = rawServiceType => {
    if (facilityType === LocationType.URGENT_CARE) {
      if (!rawServiceType) {
        return urgentCareServices.AllUrgentCare;
      }
      return urgentCareServices[rawServiceType];
    }

    if (facilityType === LocationType.EMERGENCY_CARE) {
      if (!rawServiceType) {
        return emergencyCareServices.AllEmergencyCare;
      }
      return emergencyCareServices[rawServiceType];
    }

    if (facilityType === LocationType.HEALTH) {
      if (vamcServiceDisplay) {
        return vamcServiceDisplay;
      }

      if (!rawServiceType) {
        return healthServices.All;
      }

      return healthServices[rawServiceType];
    }

    if (facilityType === LocationType.CC_PROVIDER) {
      return specialtyMap && specialtyMap[rawServiceType];
    }

    if (facilityType === LocationType.BENEFITS) {
      if (!rawServiceType) {
        return benefitsServices.All;
      }
      return benefitsServices[rawServiceType];
    }

    return rawServiceType;
  };

  const formattedServiceType = formatServiceType(serviceType);

  const messagePrefix = noResultsFound ? 'No results found' : 'Results';

  const handleNumberOfResults = () => {
    const { totalEntries, currentPage, totalPages } = pagination;
    const resultsCount = noResultsFound ? 0 : results?.length;

    if (noResultsFound) {
      return 'No results found';
    }
    if (resultsCount === 1) {
      return 'Showing 1 result';
    }

    if ((currentPage === 1 && resultsCount < 10) || totalEntries < 10) {
      return `Showing 1 - ${resultsCount} results`;
    }

    if (totalEntries > 10) {
      const startResultNum = 10 * (currentPage - 1) + 1;
      const endResultNum =
        currentPage !== totalPages ? 10 * currentPage : totalEntries;

      return `Showing ${startResultNum} - ${endResultNum} of ${totalEntries} results`;
    }
    return 'Results';
  };

  return (
    <div>
      <h2
        id="search-results-subheader"
        className="vads-u-font-family--sans vads-u-font-weight--normal vads-u-font-size--base vads-u-padding--0p5 vads-u-margin-y--1"
        tabIndex="-1"
      >
        {[LocationType.URGENT_CARE, LocationType.EMERGENCY_CARE].includes(
          facilityType,
        )
          ? messagePrefix
          : handleNumberOfResults()}{' '}
        for &quot;
        <b>{facilityTypes[facilityType]}</b>
        &quot;
        {formattedServiceType && (
          <>
            ,&nbsp;&quot;
            <b>{formattedServiceType}</b>
            &quot;
          </>
        )}
        {location && (
          <>
            &nbsp;near &quot;
            <b>{location}</b>
            &quot;
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
