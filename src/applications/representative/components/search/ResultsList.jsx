import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';

import DelayedRender from 'platform/utilities/ui/DelayedRender';
import { representativeTypes, sortOptions } from '../../config';
// import { Error } from '../../constants';

import { setFocus } from '../../utils/helpers';
// import { recordSearchResultsEvents } from '../../utils/analytics';
import { updateSearchQuery } from '../../actions';

import SearchResult from './SearchResult';

const ResultsList = props => {
  const searchResultTitle = useRef();
  const sortTypeRef = useRef();

  const {
    inProgress,
    // searchString,
    searchResults,
    // searchError,
    // pagination,
    // currentQuery,
    // query,
    // sortedSearchResults,
    // sortSearchResults,
    onUpdateSortType,
    sortType,
  } = props;

  useEffect(
    () => {
      setFocus(searchResultTitle.current);
    },
    [searchResults, inProgress, props.error],
  );

  // method for triggering sortResults when sortType updates
  const handleSortTypeChange = e => {
    onUpdateSortType({ sortType: e.target.value });
  };

  const renderResultItems = () => {
    return (
      <>
        <div
          className="representative-results-list"
          style={{ marginBottom: 25 }}
        >
          {searchResults?.map((result, index) => {
            return (
              <SearchResult
                organization={result.organization}
                key={index}
                type={result.type}
                addressLine1={result.addressLine1}
                addressLine2={result.addressLine2}
                phone={result.phone}
                distance={result.distance}
              />
            );
          })}
        </div>
      </>
    );
  };

  // const currentPage = pagination ? pagination.currentPage : 1;
  if (inProgress) {
    return (
      <div>
        {/* <va-loading-indicator
          message={`Searching for ${representativeTypeName} in ${searchString}`}
        /> */}
        <DelayedRender>
          <va-alert visible status="info">
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

  // if (searchError) {
  //   if (searchError.type === 'mapBox') {
  //     return (
  //       <SearchResultMessage
  //         representativeType={representativeTypeName}
  //         resultRef={searchResultTitle}
  //         message={Error.LOCATION}
  //       />
  //     );
  //   }
  //   return (
  //     <SearchResultMessage
  //       representativeType={representativeTypeName}
  //       resultRef={searchResultTitle}
  //       message={Error.DEFAULT}
  //       error={searchError}
  //     />
  //   );
  // }

  // const resultsData = searchResults?.map(result => ({
  //   ...result,
  //   resultItem: true,
  //   searchString,
  //   currentPage,
  // }));

  // if (resultsData.length > 0) {
  //   recordSearchResultsEvents(props, resultsData);
  // }

  const options = Object.keys(sortOptions).map(option => (
    <option key={option} value={option}>
      {sortOptions[option]}
    </option>
  ));

  return (
    <>
      {' '}
      <select
        id="representative-sorting-dropdown"
        aria-label="Sort"
        ref={sortTypeRef}
        value={sortType}
        // className="bor-rad"
        onChange={handleSortTypeChange}
        style={{ fontWeight: 'bold' }}
      >
        {' '}
        {options}{' '}
      </select>
      <div>{renderResultItems()}</div>
    </>
  );
};

ResultsList.propTypes = {
  currentQuery: PropTypes.object,
  error: PropTypes.object,
  representativeTypeName: PropTypes.string,
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
    },
    dispatch,
  );
}

function mapStateToProps(state) {
  const {
    context,
    representativeType,
    inProgress,
    position,
    searchString,
  } = state.searchQuery;

  const representativeTypeName = representativeTypes[representativeType];

  return {
    currentQuery: state.searchQuery,
    context,
    representativeTypeName,
    inProgress,
    results: state.searchResult.results,
    searchError: state.searchResult.error,
    pagination: state.searchResult.pagination,
    position,
    searchString,
    selectedResult: state.searchResult.selectedResult,
    resultTime: state.searchResult.resultTime,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ResultsList);
