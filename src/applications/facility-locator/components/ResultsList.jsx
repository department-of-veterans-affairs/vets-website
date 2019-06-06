/* eslint-disable arrow-body-style */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import Pagination from '@department-of-veterans-affairs/formation-react/Pagination';

import { facilityTypes } from '../config';

import { distBetween } from '../utils/facilityDistance';
import { setFocus } from '../utils/helpers';

import { updateSearchQuery, searchWithBounds } from '../actions';

import SearchResult from './SearchResult';
import DelayedRender from 'platform/utilities/ui/DelayedRender';

const timeoutErrorCode = '504';

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

  handlePageSelect = page => {
    const { currentQuery } = this.props;
    console.log('currentQuery', currentQuery);
    this.props.searchWithBounds({
      bounds: currentQuery.bounds,
      facilityType: currentQuery.facilityType,
      serviceType: currentQuery.serviceType,
      page,
    });
  };

  render() {
    const {
      context,
      facilityTypeName,
      inProgress,
      position,
      searchString,
      results,
      error,
      isMobile,
      pagination: { currentPage, totalPages, totalEntries },
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

    if (error && error.find(err => err.code === timeoutErrorCode)) {
      /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
      return (
        <div
          className="search-result-title facility-result"
          ref={this.searchResultTitle}
        >
          The search has timed out, please retry your search.
        </div>
      );
      /* eslint-enable jsx-a11y/no-noninteractive-tabindex */
    }
    if (!results || results.length < 1) {
      /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
      return (
        <div
          className="search-result-title facility-result"
          ref={this.searchResultTitle}
        >
          No facilities found. Please try entering a different search term
          (Street, City, State or Zip) and click search to find facilities.
        </div>
      );
      /* eslint-enable jsx-a11y/no-noninteractive-tabindex */
    }
    const currentLocation = position;
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
        return { ...result, distance };
      })
      .sort((resultA, resultB) => {
        return resultA.distance - resultB.distance;
      });

    return (
      <div>
        {/* eslint-disable jsx-a11y/no-noninteractive-tabindex */}
        <p className="search-result-title" ref={this.searchResultTitle}>
          {/* eslint-enable jsx-a11y/no-noninteractive-tabindex */}
          {`${totalEntries} results for ${facilityTypeName} near `}
          <strong>“{context}”</strong>
        </p>
        <div>
          {sortedResults.map(r => {
            /* eslint-disable prettier/prettier */
            return isMobile ? (
              <div key={r.id} className="mobile-search-result">
                <SearchResult result={r} />
              </div>
            ) : (
              <SearchResult key={r.id} result={r} />
              );
            /* eslint-enable prettier/prettier */
          })}
        </div>
        <Pagination
          onPageSelect={this.handlePageSelect}
          page={currentPage}
          pages={totalPages}
        />
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
