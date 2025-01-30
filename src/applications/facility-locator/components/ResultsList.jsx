import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import DelayedRender from 'platform/utilities/ui/DelayedRender';
import { facilityTypes } from '../config';
import {
  CLINIC_URGENTCARE_SERVICE,
  PHARMACY_RETAIL_SERVICE,
  LocationType,
  Error,
  Covid19Vaccine,
  EMERGENCY_CARE_SERVICES,
} from '../constants';

import { recordSearchResultsEvents } from '../utils/analytics';
import { isHealthAndHealthConnect } from '../utils/phoneNumbers';
import { updateSearchQuery, searchWithBounds } from '../actions';

import VaFacilityResult from './search-results-items/VaFacilityResult';
import CCProviderResult from './search-results-items/CCProviderResult';
import PharmacyResult from './search-results-items/PharmacyResult';
import UrgentCareResult from './search-results-items/UrgentCareResult';
import EmergencyCareResult from './search-results-items/EmergencyCareResult';
import Covid19Result from './search-results-items/Covid19Result';
import SearchResultMessage from './SearchResultMessage';

export const ResultsList = ({
  facilityTypeName,
  inProgress,
  isMobile,
  searchString,
  results,
  searchError,
  pagination,
  currentQuery,
  query,
  searchResultMessageRef,
  ...props
}) => {
  const [resultsData, setResultsData] = useState(null);
  const currentPage = pagination ? pagination.currentPage : 1;

  useEffect(
    () => {
      setResultsData(
        results.map((result, index) => ({
          ...result,
          resultItem: true,
          searchString,
          currentPage,
          markerText: index + 1,
        })),
      );
    },
    [results],
  );

  useEffect(
    () => {
      if (resultsData?.length) {
        recordSearchResultsEvents(props, resultsData);
      }
    },
    [resultsData],
  );

  /**
   * Returns Result items by type
   * @param query object
   * @param apiResults array list
   * @returns [] list of results
   */
  const renderResultItems = (searchQuery, apiResults) => {
    return apiResults?.map((result, index) => {
      let item;
      const showHealthConnectNumber = isHealthAndHealthConnect(result, query);

      switch (searchQuery.facilityType) {
        case 'health':
        case 'cemetery':
        case 'benefits':
        case 'vet_center':
          item =
            searchQuery.serviceType === Covid19Vaccine ? (
              <Covid19Result location={result} key={result.id} index={index} />
            ) : (
              <VaFacilityResult
                location={result}
                query={searchQuery}
                key={result.id}
                index={index}
                showHealthConnectNumber={showHealthConnectNumber}
              />
            );
          break;
        case 'provider':
          // Support non va urgent care search through ccp option
          if (searchQuery.serviceType === CLINIC_URGENTCARE_SERVICE) {
            item = (
              <UrgentCareResult
                provider={result}
                query={searchQuery}
                key={result.id}
              />
            );
          } else if (searchQuery.serviceType === PHARMACY_RETAIL_SERVICE) {
            item = (
              <PharmacyResult
                provider={result}
                query={searchQuery}
                key={result.id}
              />
            );
          } else if (
            EMERGENCY_CARE_SERVICES.includes(searchQuery.serviceType)
          ) {
            item = (
              <EmergencyCareResult
                provider={result}
                query={searchQuery}
                key={result.id}
              />
            );
          } else {
            item = (
              <CCProviderResult
                provider={result}
                query={searchQuery}
                key={result.id}
              />
            );
          }
          break;
        case 'pharmacy':
          item = (
            <PharmacyResult
              provider={result}
              query={searchQuery}
              key={result.id}
            />
          );
          break;
        case 'emergency_care':
          if (result.type === LocationType.CC_PROVIDER) {
            item = (
              <EmergencyCareResult
                provider={result}
                query={searchQuery}
                key={result.id}
              />
            );
          } else {
            item = (
              <VaFacilityResult
                location={result}
                query={searchQuery}
                key={result.id}
                index={index}
              />
            );
          }
          break;
        case 'urgent_care':
          if (result.type === LocationType.CC_PROVIDER) {
            item = (
              <UrgentCareResult
                provider={result}
                query={searchQuery}
                key={result.id}
              />
            );
          } else {
            item = (
              <VaFacilityResult
                location={result}
                query={searchQuery}
                key={result.id}
                index={index}
              />
            );
          }
          break;
        default:
          item = null;
      }

      return item;
    });
  };

  if (inProgress) {
    return (
      <div>
        <va-loading-indicator
          message={`Searching for ${facilityTypeName} in ${searchString}`}
        />
        <DelayedRender>
          <va-alert visible status="info" uswds>
            <h3 slot="headline">Please wait</h3>
            <p>
              Your results should appear in less than a minute. Thank you for
              your patience.
            </p>
          </va-alert>
        </DelayedRender>
      </div>
    );
  }

  if (searchError) {
    if (searchError.type === 'mapBox') {
      return (
        <SearchResultMessage
          resultRef={searchResultMessageRef}
          message={Error.LOCATION}
          searchStarted={currentQuery.searchStarted}
        />
      );
    }

    return (
      <SearchResultMessage
        error={searchError}
        isMobile={isMobile}
        message={Error.DEFAULT}
        resultRef={searchResultMessageRef}
        searchStarted={currentQuery.searchStarted}
      />
    );
  }

  if (facilityTypeName && !results.length) {
    return (
      <SearchResultMessage
        isMobile={isMobile}
        resultsFound={false}
        resultRef={searchResultMessageRef}
        searchStarted={currentQuery.searchStarted}
      />
    );
  }

  if (!facilityTypeName || !currentQuery.facilityType) {
    return <SearchResultMessage searchStarted={currentQuery.searchStarted} />;
  }

  return <div>{renderResultItems(query, resultsData)}</div>;
};

ResultsList.propTypes = {
  currentQuery: PropTypes.object,
  error: PropTypes.object,
  facilityTypeName: PropTypes.string,
  inProgress: PropTypes.bool,
  isMobile: PropTypes.bool,
  pagination: PropTypes.object,
  query: PropTypes.object,
  results: PropTypes.array,
  searchError: PropTypes.shape(PropTypes.any),
  searchResultMessageRef: PropTypes.object,
  searchString: PropTypes.string,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      updateSearchQuery,
      searchWithBounds,
    },
    dispatch,
  );
}

function mapStateToProps(state) {
  const {
    context,
    facilityType,
    inProgress,
    position,
    searchString,
  } = state.searchQuery;

  const facilityTypeName = facilityTypes[facilityType];

  return {
    currentQuery: state.searchQuery,
    context,
    facilityTypeName,
    inProgress,
    results: state.searchResult.results,
    searchError: state.searchResult.error,
    pagination: state.searchResult.pagination,
    position,
    searchString,
    resultTime: state.searchResult.resultTime,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ResultsList);
