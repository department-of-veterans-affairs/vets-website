import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

import { facilityTypes } from '../config';
import {
  MARKER_LETTERS,
  CLINIC_URGENTCARE_SERVICE,
  PHARMACY_RETAIL_SERVICE,
  LocationType,
  Error,
} from '../constants';

import { distBetween } from '../utils/facilityDistance';
import { setFocus } from '../utils/helpers';

import { updateSearchQuery, searchWithBounds } from '../actions';

import DelayedRender from 'platform/utilities/ui/DelayedRender';
import VaFacilityResult from './search-results-items/VaFacilityResult';
import CCProviderResult from './search-results-items/CCProviderResult';
import PharmacyResult from './search-results-items/PharmacyResult';
import UrgentCareResult from './search-results-items/UrgentCareResult';
import SearchResultMessage from './SearchResultMessage';
import recordEvent from 'platform/monitoring/record-event';

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
          item = (
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
          } else {
            item = <CCProviderResult provider={r} query={query} key={r.id} />;
          }
          break;
        case 'pharmacy':
          item = <PharmacyResult provider={r} query={query} key={r.id} />;
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

      if (index === 0 && r.distance) {
        recordEvent({ 'fl-closest-result-distance-miles': r.distance });
      }

      return item;
    });
  }

  render() {
    const {
      facilityTypeName,
      inProgress,
      position,
      searchString,
      results,
      error,
      pagination: { currentPage },
      currentQuery,
      query,
    } = this.props;

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
    } else if (currentQuery.error && error.type === 'mapBox') {
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

    const currentLocation = position;
    const markers = MARKER_LETTERS.values();
    const sortedResults = results
      .map(result => {
        const distance = currentLocation
          ? distBetween(
              currentLocation.latitude,
              currentLocation.longitude,
              result.attributes.lat,
              result.attributes.long,
            )
          : null;
        return {
          ...result,
          distance,
          resultItem: true,
          searchString,
          currentPage,
        };
      })
      .sort((resultA, resultB) => resultA.distance - resultB.distance)
      .map(result => {
        const markerText = markers.next().value;
        return {
          ...result,
          markerText,
        };
      });
    return <div>{this.renderResultItems(query, sortedResults)}</div>;
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
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ResultsList);
