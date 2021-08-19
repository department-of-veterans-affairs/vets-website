import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

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
import {
  covidVaccineSchedulingFrontend,
  facilityLocatorCovidVaccineWalkInAvailabilityTextFrontend,
} from '../utils/featureFlagSelectors';

const TIMEOUTS = new Set(['408', '504', '503']);

class ResultsList extends Component {
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
    return results.map((r, index) => {
      let item;
      switch (query.facilityType) {
        case 'health':
        case 'cemetery':
        case 'benefits':
        case 'vet_center':
          item =
            query.serviceType === Covid19Vaccine ? (
              <Covid19Result
                location={r}
                key={r.id}
                index={index}
                showCovidVaccineSchedulingLinks={
                  this.props.showCovidVaccineSchedulingLinks
                }
                showCovidVaccineWalkInAvailabilityText={
                  this.props.showCovidVaccineWalkInAvailabilityText
                }
              />
            ) : (
              <VaFacilityResult
                location={r}
                query={query}
                key={r.id}
                index={index}
              />
            );
          break;
        case 'provider':
          // Support non va urgent care search through ccp option
          if (query.serviceType === CLINIC_URGENTCARE_SERVICE) {
            item = <UrgentCareResult provider={r} query={query} key={r.id} />;
          } else if (query.serviceType === PHARMACY_RETAIL_SERVICE) {
            item = <PharmacyResult provider={r} query={query} key={r.id} />;
          } else if (EMERGENCY_CARE_SERVICES.includes(query.serviceType)) {
            item = (
              <EmergencyCareResult provider={r} query={query} key={r.id} />
            );
          } else {
            item = <CCProviderResult provider={r} query={query} key={r.id} />;
          }
          break;
        case 'pharmacy':
          item = <PharmacyResult provider={r} query={query} key={r.id} />;
          break;
        case 'emergency_care':
          if (r.type === LocationType.CC_PROVIDER) {
            item = (
              <EmergencyCareResult provider={r} query={query} key={r.id} />
            );
          } else {
            item = (
              <VaFacilityResult
                location={r}
                query={query}
                key={r.id}
                index={index}
              />
            );
          }
          break;
        case 'urgent_care':
          if (r.type === LocationType.CC_PROVIDER) {
            item = <UrgentCareResult provider={r} query={query} key={r.id} />;
          } else {
            item = (
              <VaFacilityResult
                location={r}
                query={query}
                key={r.id}
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
      error,
      pagination,
      currentQuery,
      query,
    } = this.props;

    const currentPage = pagination ? pagination.currentPage : 1;

    if (inProgress) {
      return (
        <div>
          <LoadingIndicator
            message={`Searching for ${facilityTypeName}
            in ${searchString}`}
          />
          <DelayedRender>
            <AlertBox
              isVisible
              status="info"
              headline="Please wait"
              content="Your results should appear in less than a minute. Thank you for your patience."
            />
          </DelayedRender>
        </div>
      );
    }

    if (error && Array.isArray(error)) {
      const timedOut = error.find(err => TIMEOUTS.has(err.code));
      if (timedOut) {
        return (
          <SearchResultMessage
            facilityType={facilityTypeName}
            resultRef={this.searchResultTitle}
            message={Error.DEFAULT}
            error={error}
          />
        );
      }
    } else if (currentQuery.error && currentQuery.error.type === 'mapBox') {
      return (
        <SearchResultMessage
          facilityType={facilityTypeName}
          resultRef={this.searchResultTitle}
          message={Error.LOCATION}
          error={error}
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
    error: state.searchResult.error,
    pagination: state.searchResult.pagination,
    position,
    searchString,
    selectedResult: state.searchResult.selectedResult,
    resultTime: state.searchResult.resultTime,
    showCovidVaccineSchedulingLinks: covidVaccineSchedulingFrontend(state),
    showCovidVaccineWalkInAvailabilityText: facilityLocatorCovidVaccineWalkInAvailabilityTextFrontend(
      state,
    ),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ResultsList);
