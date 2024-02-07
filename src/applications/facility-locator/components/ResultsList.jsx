import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

import DelayedRender from 'platform/utilities/ui/DelayedRender';
import { facilityTypes } from '../config';
import {
  MARKER_LETTERS,
  CLINIC_URGENTCARE_SERVICE,
  PHARMACY_RETAIL_SERVICE,
  LocationType,
  Error,
  Covid19Vaccine,
  EMERGENCY_CARE_SERVICES,
} from '../constants';

import { setFocus } from '../utils/helpers';
import { recordSearchResultsEvents } from '../utils/analytics';
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
  searchString,
  results,
  searchError,
  pagination,
  currentQuery,
  query,
  ...props
}) => {
  const searchResultTitle = useRef();

  useEffect(
    () => {
      setFocus(searchResultTitle.current);
    },
    [results, inProgress, props.error],
  );

  function isHealthAndHealthConnect(apiResult, searchQuery) {
    let final = false;
    if (
      searchQuery?.facilityType === 'health' &&
      apiResult?.attributes?.phone?.healthConnect !== null
    ) {
      final = true;
    }
    return final;
  }

  /**
   * Returns Result items by type
   * @param query object
   * @param apiResults array list
   * @returns [] list of results
   */
  const renderResultItems = (searchQuery, apiResults) => {
    return apiResults.map((result, index) => {
      let item;
      const services = result?.attributes?.detailedServices;
      const walkInsAccepted = Array.isArray(services)
        ? services[0]?.walkInsAccepted
        : 'false';

      const showHealthConnectNumber = isHealthAndHealthConnect(result, query);

      switch (searchQuery.facilityType) {
        case 'health':
        case 'cemetery':
        case 'benefits':
        case 'vet_center':
          item =
            searchQuery.serviceType === Covid19Vaccine ? (
              <Covid19Result
                location={result}
                key={result.id}
                index={index}
                showCovidVaccineWalkInAvailabilityText={
                  (walkInsAccepted || '').toLowerCase() === 'true'
                }
              />
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

  const currentPage = pagination ? pagination.currentPage : 1;
  if (inProgress) {
    return (
      <div>
        <va-loading-indicator
          message={`Searching for ${facilityTypeName} in ${searchString}`}
        />
        <DelayedRender>
          <va-alert visible status="info" uswds="false">
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
          facilityType={facilityTypeName}
          resultRef={searchResultTitle}
          message={Error.LOCATION}
        />
      );
    }
    return (
      <SearchResultMessage
        facilityType={facilityTypeName}
        resultRef={searchResultTitle}
        message={Error.DEFAULT}
        error={searchError}
      />
    );
  }

  if (facilityTypeName && (!results || results.length < 1)) {
    return (
      <SearchResultMessage
        facilityType={facilityTypeName}
        resultsFound={results === 0}
        resultRef={searchResultTitle}
      />
    );
  }
  if (!facilityTypeName || !currentQuery.facilityType) {
    return <SearchResultMessage />;
  }

  const markers = MARKER_LETTERS.values();
  const resultsData = results.map(result => ({
    ...result,
    resultItem: true,
    searchString,
    currentPage,
    markerText: markers.next().value,
  }));

  if (resultsData.length > 0) {
    recordSearchResultsEvents(props, resultsData);
  }
  return <div>{renderResultItems(query, resultsData)}</div>;
};

ResultsList.propTypes = {
  currentQuery: PropTypes.object,
  error: PropTypes.object,
  facilityTypeName: PropTypes.string,
  inProgress: PropTypes.bool,
  pagination: PropTypes.object,
  query: PropTypes.object,
  results: PropTypes.array,
  searchError: PropTypes.object,
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
    selectedResult: state.searchResult.selectedResult,
    resultTime: state.searchResult.resultTime,
    facilityLocatorShowHealthConnectNumber: toggleValues(state)[
      FEATURE_FLAG_NAMES.facilityLocatorShowHealthConnectNumber
    ],
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ResultsList);
