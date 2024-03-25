import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { focusElement } from 'platform/utilities/ui';
import { representativeTypes } from '../../config';
import { updateSearchQuery } from '../../actions';

import SearchResult from './SearchResult';

const ResultsList = props => {
  const searchResultTitle = useRef();

  const { inProgress, searchResults, query } = props;

  useEffect(
    () => {
      focusElement(searchResultTitle.current);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchResults, inProgress, props.error],
  );

  return (
    <>
      <div className="representative-results-list">
        {searchResults.length ? <hr /> : null}
        {searchResults?.map((result, index) => {
          return (
            <div key={index} className="vads-u-margin-top--4">
              <SearchResult
                officer={result.attributes.fullName || result.attributes.name}
                reports={result.reports}
                key={index}
                type={result.type}
                addressLine1={result.attributes.addressLine1}
                addressLine2={result.attributes.addressLine2}
                addressLine3={result.attributes.addressLine3}
                city={result.attributes.city}
                stateCode={result.attributes.stateCode}
                zipCode={result.attributes.zipCode}
                phone={result.attributes.phone}
                email={result.attributes.email}
                distance={result.attributes.distance}
                associatedOrgs={result.attributes.organizationNames}
                representative={result}
                representativeId={result.id}
                searchResults={searchResults}
                submitRepresentativeReport={props.submitRepresentativeReport}
                initializeRepresentativeReport={
                  props.initializeRepresentativeReport
                }
                reportSubmissionStatus={props.reportSubmissionStatus}
                query={query}
                index={index}
              />
            </div>
          );
        })}
      </div>
    </>
  );
};

ResultsList.propTypes = {
  currentQuery: PropTypes.object,
  error: PropTypes.object,
  inProgress: PropTypes.bool,
  initializeRepresentativeReport: PropTypes.func,
  pagination: PropTypes.object,
  query: PropTypes.object,
  reportSubmissionStatus: PropTypes.string,
  representativeTypeName: PropTypes.string,
  searchError: PropTypes.object,
  searchResults: PropTypes.array,
  sortType: PropTypes.string,
  submitRepresentativeReport: PropTypes.func,
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
