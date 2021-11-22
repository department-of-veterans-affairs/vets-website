import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

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

import DelayedRender from 'platform/utilities/ui/DelayedRender';
import VaFacilityResult from './search-results-items/VaFacilityResult';
import CCProviderResult from './search-results-items/CCProviderResult';
import PharmacyResult from './search-results-items/PharmacyResult';
import UrgentCareResult from './search-results-items/UrgentCareResult';
import EmergencyCareResult from './search-results-items/EmergencyCareResult';
import Covid19Result from './search-results-items/Covid19Result';
import SearchResultMessage from './SearchResultMessage';
import { covidVaccineSchedulingFrontend } from '../utils/featureFlagSelectors';

export class ResultsList extends Component {
  constructor(props) {
    super(props);
    this.searchResultTitle = React.createRef();
  }

  shouldComponentUpdate(nextProps) {
    return (
      nextProps.results !== this.props.results ||
      nextProps.inProgress !== this.props.inProgress ||
      nextProps.error !== this.props.error
    );
  }

  componentDidUpdate() {
    if (this.searchResultTitle.current) {
      setFocus(this.searchResultTitle.current);
    }
  }

  /**
   * Returns Result items by type
   * @param query object
   * @param results array list
   * @returns [] list of results
   */
  renderResultItems(query, results) {
    return results.map((result, index) => {
      let item;
      const services = result?.attributes?.detailedServices;
      const walkInsAccepted = Array.isArray(services)
        ? services[0]?.walkInsAccepted
        : 'false';

      const showHealthConnectNumber =
        result?.attributes?.visn === '8' &&
        query?.facilityType === 'health' &&
        this.props.facilityLocatorShowHealthConnectNumber;

      switch (query.facilityType) {
        case 'health':
        case 'cemetery':
        case 'benefits':
        case 'vet_center':
          item =
            query.serviceType === Covid19Vaccine ? (
              <Covid19Result
                location={result}
                key={result.id}
                index={index}
                showCovidVaccineSchedulingLinks={
                  this.props.showCovidVaccineSchedulingLinks
                }
                showCovidVaccineWalkInAvailabilityText={
                  (walkInsAccepted || '').toLowerCase() === 'true'
                }
              />
            ) : (
              <VaFacilityResult
                location={result}
                query={query}
                key={result.id}
                index={index}
                showHealthConnectNumber={showHealthConnectNumber}
              />
            );
          break;
        case 'provider':
          // Support non va urgent care search through ccp option
          if (query.serviceType === CLINIC_URGENTCARE_SERVICE) {
            item = (
              <UrgentCareResult
                provider={result}
                query={query}
                key={result.id}
              />
            );
          } else if (query.serviceType === PHARMACY_RETAIL_SERVICE) {
            item = (
              <PharmacyResult provider={result} query={query} key={result.id} />
            );
          } else if (EMERGENCY_CARE_SERVICES.includes(query.serviceType)) {
            item = (
              <EmergencyCareResult
                provider={result}
                query={query}
                key={result.id}
              />
            );
          } else {
            item = (
              <CCProviderResult
                provider={result}
                query={query}
                key={result.id}
              />
            );
          }
          break;
        case 'pharmacy':
          item = (
            <PharmacyResult provider={result} query={query} key={result.id} />
          );
          break;
        case 'emergency_care':
          if (result.type === LocationType.CC_PROVIDER) {
            item = (
              <EmergencyCareResult
                provider={result}
                query={query}
                key={result.id}
              />
            );
          } else {
            item = (
              <VaFacilityResult
                location={result}
                query={query}
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
                query={query}
                key={result.id}
              />
            );
          } else {
            item = (
              <VaFacilityResult
                location={result}
                query={query}
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
  }

  render() {
    const {
      facilityTypeName,
      inProgress,
      searchString,
      results,
      searchError,
      pagination,
      currentQuery,
      query,
    } = this.props;

    const currentPage = pagination ? pagination.currentPage : 1;
    if (inProgress) {
      return (
        <div>
          <va-loading-indicator
            message={`Searching for ${facilityTypeName} in ${searchString}`}
          />
          <DelayedRender>
            <va-alert visible status="info">
              <h3 slot="headline">Please wait</h3>
              <div>
                Your results should appear in less than a minute. Thank you for
                your patience.
              </div>
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
            resultRef={this.searchResultTitle}
            message={Error.LOCATION}
          />
        );
      }
      return (
        <SearchResultMessage
          facilityType={facilityTypeName}
          resultRef={this.searchResultTitle}
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
          resultRef={this.searchResultTitle}
        />
      );
    } else if (!facilityTypeName || !currentQuery.facilityType) {
      return <SearchResultMessage />;
    }

    const markers = MARKER_LETTERS.values();
    const resultsData = results
      .map(result => {
        return {
          ...result,
          resultItem: true,
          searchString,
          currentPage,
        };
      })
      .map(result => {
        const markerText = markers.next().value;
        return {
          ...result,
          markerText,
        };
      });

    if (resultsData.length > 0) {
      recordSearchResultsEvents(this.props, resultsData);
    }
    return <div>{this.renderResultItems(query, resultsData)}</div>;
  }
}

ResultsList.propTypes = {
  results: PropTypes.array,
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
    showCovidVaccineSchedulingLinks: covidVaccineSchedulingFrontend(state),
    facilityLocatorShowHealthConnectNumber: toggleValues(state)[
      FEATURE_FLAG_NAMES.facilityLocatorShowHealthConnectNumber
    ],
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ResultsList);
