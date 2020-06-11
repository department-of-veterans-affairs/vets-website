import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

import { facilityTypes } from '../config';
import { MARKER_LETTERS } from '../constants';

import { distBetween } from '../utils/facilityDistance';
import { setFocus } from '../utils/helpers';

import { updateSearchQuery, searchWithBounds } from '../actions';

import SearchResult from './SearchResult';
import DelayedRender from 'platform/utilities/ui/DelayedRender';

const TIMEOUTS = new Set(['408', '504', '503']);

class ResultsList extends Component {
  constructor(props) {
    super(props);
    this.searchResultTitle = React.createRef();
  }
  shouldComponentUpdate(nextProps) {
    return (
      nextProps.results !== this.props.results ||
      nextProps.inProgress !== this.props.inProgress
    );
  }

  componentDidUpdate() {
    if (this.searchResultTitle.current) {
      setFocus(this.searchResultTitle.current);
    }
  }

  render() {
    const {
      facilityTypeName,
      inProgress,
      position,
      searchString,
      results,
      error,
      isMobile,
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

    if (error) {
      // For some reason, an error can be an HTTP response, or just a string.
      if (Array.isArray(error)) {
        const timedOut = error.find(err => TIMEOUTS.has(err.code));
        if (timedOut) {
          return (
            <div
              className="search-result-title facility-result"
              ref={this.searchResultTitle}
            >
              <p>
                We’re sorry. We couldn’t complete your request. We’re aware of
                this problem, and we’re working to fix it as soon as possible.
                Please try again later.
              </p>
              <p>
                If you need care right away for a minor illness or injury,
                select Urgent care under facility type, then select either VA or
                community providers as the service type.
              </p>
              <p>
                If you have a medical emergency, please go to your nearest
                emergency room or call 911.
              </p>
            </div>
          );
        }
      }

      return (
        <div
          className="search-result-title facility-result"
          ref={this.searchResultTitle}
        >
          <p>We’re sorry. We couldn’t complete your request.</p>
          <p>
            If you need care right away for a minor illness or injury, select
            Urgent care under facility type, then select either VA or community
            providers as the service type.
          </p>
          <p>
            If you have a medical emergency, please go to your nearest emergency
            room or call 911.
          </p>
        </div>
      );
    }

    if (!results || results.length < 1) {
      if (this.props.facilityTypeName === facilityTypes.cc_provider) {
        return (
          <div
            className="search-result-title facility-result"
            ref={this.searchResultTitle}
          >
            We didn't find any facilities near you. <br />
            <strong>To try again, please enter a different:</strong>
            <ul className="vads-u-margin-y--1p5">
              <li>
                <strong>Search term</strong> (street, city, state, or postal
                code), <strong>or</strong>
              </li>
              <li>
                <strong>Service type</strong> (like “primary care”), and select
                the option that best meets your needs
              </li>
            </ul>
            Then click <strong>Search</strong>.
          </div>
        );
      }
      return (
        <div
          className="search-result-title facility-result"
          ref={this.searchResultTitle}
        >
          No facilities found. Please try entering a different search term
          (Street, City, State or Postal code) and click search to find
          facilities.
        </div>
      );
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
    return (
      <div>
        <div>
          {sortedResults.map(
            r =>
              isMobile ? (
                <div key={r.id} className="mobile-search-result">
                  <SearchResult result={r} query={query} />
                </div>
              ) : (
                <SearchResult key={r.id} result={r} query={query} />
              ),
          )}
        </div>
      </div>
    );
  }
}

ResultsList.propTypes = {
  results: PropTypes.array,
  isMobile: PropTypes.bool,
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
