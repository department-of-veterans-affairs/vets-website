import PropTypes from 'prop-types';
import React from 'react';
import {
  facilityTypes,
  urgentCareServices,
  healthServices,
  benefitsServices,
  emergencyCareServices,
} from '../config';
import { LocationType } from '../constants';
import { connect } from 'react-redux';

export const SearchResultsHeader = ({
  results,
  facilityType,
  serviceType,
  context,
  inProgress,
  specialtyMap,
  pagination,
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
    if (noResultsFound) {
      return 'No results found';
    } else if (totalEntries === 1) {
      return 'Showing 1 result';
    } else if (totalEntries < 11 && totalEntries > 1) {
      return `Showing 1 - ${totalEntries} results`;
    } else if (totalEntries > 10) {
      const startResultNum = 10 * (currentPage - 1) + 1;
      let endResultNum;

      if (currentPage !== totalPages) {
        endResultNum = 10 * currentPage;
      } else endResultNum = totalEntries;

      return `Showing ${startResultNum} - ${endResultNum} of ${totalEntries} results`;
    } else return 'Results';
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
  results: PropTypes.array,
  facilityType: PropTypes.string,
  serviceType: PropTypes.string,
  context: PropTypes.string,
  specialtyMap: PropTypes.object,
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
});

export default React.memo(
  connect(mapStateToProps)(SearchResultsHeader),
  areEqual,
);
