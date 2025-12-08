import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DelayedRender from 'platform/utilities/ui/DelayedRender';
import { facilityTypes } from '../config';
import { Error } from '../constants';
import { recordSearchResultsEvents } from '../utils/analytics';
import { ResultMapper } from './search-results-items/common/ResultMapper';
import { updateSearchQuery, searchWithBounds } from '../actions/search';
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
      return ResultMapper(result, searchQuery, index);
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
  searchError: PropTypes.string,
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
