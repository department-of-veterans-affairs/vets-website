import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// import mockData from '../../constants/mock-representative-data.json';

import { representativeTypes, sortOptions } from '../../config';

import { setFocus } from '../../utils/helpers';
import { recordSearchResultsEvents } from '../../utils/analytics';
import { updateSearchQuery } from '../../actions';

import SearchResult from './SearchResult';

const ResultsList = props => {
  const searchResultTitle = useRef();

  const {
    inProgress,
    searchResults,
    // pagination,
    // currentQuery,
    query,
    sortType,
  } = props;

  useEffect(
    () => {
      setFocus(searchResultTitle.current);
      recordSearchResultsEvents(searchResults, props);
    },
    [searchResults, inProgress, props.error],
  );

  // method for triggering sortResults when sortType updates
  const handleSortTypeChange = e => {
    props.updateSearchQuery({
      id: Date.now(),
      sortType: e.target.value,
    });
  };

  // const currentPage = pagination ? pagination.currentPage : 1;

  const renderResultItems = (
    searchQuery,
    // apiResults
  ) => {
    const sQuery = searchQuery;
    return (
      <>
        <div
          className="representative-results-list"
          style={{ marginBottom: 25 }}
        >
          {searchResults.data?.map((result, index) => {
            return (
              <>
                <hr />
                <SearchResult
                  organization={
                    result.attributes.fullName || result.attributes.name
                  }
                  key={result.id}
                  type={result.type}
                  addressLine1={result.attributes.addressLine1}
                  addressLine2={result.attributes.addressLine2}
                  addressLine3={result.attributes.addressLine3}
                  city={result.attributes.city}
                  state={result.attributes.stateCode}
                  zipCode={result.attributes.zipCode}
                  phone={result.attributes.phone}
                  distance={result.attributes.distance}
                  representative={result}
                  query={sQuery}
                  index={index}
                />
              </>
            );
          })}
        </div>
      </>
    );
  };

  const options = Object.keys(sortOptions).map(option => (
    <option key={option} value={option}>
      {sortOptions[option]}
    </option>
  ));

  return (
    <>
      {searchResults?.data?.length && (
        <>
          <label htmlFor="sort-by-dropdown">Sort by</label>
          <select
            id="representative-sorting-dropdown"
            aria-label="Sort"
            // ref={sortTypeRef}
            value={sortType}
            title="Sort by:"
            onChange={handleSortTypeChange}
            style={{ fontWeight: 'bold' }}
          >
            {' '}
            {options}{' '}
          </select>
          <div>{renderResultItems(query)}</div>
        </>
      )}
    </>
  );
};

ResultsList.propTypes = {
  currentQuery: PropTypes.object,
  error: PropTypes.object,
  inProgress: PropTypes.bool,
  pagination: PropTypes.object,
  query: PropTypes.object,
  representativeTypeName: PropTypes.string,
  searchError: PropTypes.object,
  searchResults: PropTypes.array,
  sortType: PropTypes.string,
  onUpdateSortType: PropTypes.func,
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
    locationQueryString,
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
    locationQueryString,
    selectedResult: state.searchResult.selectedResult,
    resultTime: state.searchResult.resultTime,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ResultsList);
