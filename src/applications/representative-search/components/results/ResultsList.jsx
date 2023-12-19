import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { representativeTypes } from '../../config';
import { setFocus } from '../../utils/helpers';
import { recordSearchResultsEvents } from '../../utils/analytics';
import { updateSearchQuery } from '../../actions';

import SearchResult from './SearchResult';

const ResultsList = props => {
  const searchResultTitle = useRef();

  const { inProgress, searchResults, query } = props;

  useEffect(
    () => {
      setFocus(searchResultTitle.current);
      recordSearchResultsEvents(searchResults, props);
    },
    [searchResults, inProgress, props.error],
  );

  const renderResultItems = searchQuery => {
    const sQuery = searchQuery;
    return (
      <>
        <div
          className="representative-results-list"
          style={{ marginBottom: 25 }}
        >
          <hr />

          {searchResults?.map((result, index) => {
            return (
              <>
                <SearchResult
                  officer={result.attributes.fullName || result.attributes.name}
                  key={result.id}
                  type={result.type}
                  addressLine1={result.attributes.addressLine1}
                  addressLine2={result.attributes.addressLine2}
                  addressLine3={result.attributes.addressLine3}
                  city={result.attributes.city}
                  state={result.attributes.stateCode}
                  zipCode={result.attributes.zipCode}
                  phone={result.attributes.phone}
                  email={result.attributes.email}
                  distance={result.attributes.distance}
                  representative={result}
                  query={sQuery}
                  index={index}
                />
                <hr />
              </>
            );
          })}
        </div>
      </>
    );
  };

  return (
    <>
      {searchResults?.length ? (
        <>
          <div>{renderResultItems(query)}</div>
        </>
      ) : null}
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
