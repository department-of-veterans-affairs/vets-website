import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

/* eslint-disable camelcase */

export const SearchResultsHeader = props => {
  const { searchResults, searchCounter, inProgress, pagination } = props;

  const { totalEntries, currentPage, totalPages } = pagination;

  const noResultsFound = !searchResults || !searchResults.length;

  if (inProgress || searchCounter === 0) {
    return <div style={{ height: '38px' }} />;
  }

  const repFormat = {
    organization: 'Veteran Service Organizations',
    attorney: 'Attornies',
    claim_agents: 'Claim Agents',
  };

  const urlParams = new URLSearchParams(location.search);

  const address = urlParams.get('address');
  const repOrgName = urlParams.get('name');
  const representativeType = repFormat[urlParams.get('type')];

  const handleNumberOfResults = () => {
    if (noResultsFound) {
      return 'No results found';
    }
    if (totalEntries === 1) {
      return 'Showing 1 result';
    }
    if (totalEntries < 11 && totalEntries > 1) {
      return `Showing 1 - ${totalEntries} results`;
    }
    if (totalEntries > 10) {
      const startResultNum = 10 * (currentPage - 1) + 1;
      let endResultNum;

      if (currentPage !== totalPages) {
        endResultNum = 10 * currentPage;
      } else endResultNum = totalEntries;

      return `Showing ${startResultNum} - ${endResultNum} of ${totalEntries} results`;
    }
    return 'Results';
  };

  return (
    <div className="search-results-header vads-u-margin-top--6">
      <h2
        id="search-results-subheader"
        className="vads-u-font-family--sans vads-u-font-weight--normal vads-u-font-size--base vads-u-padding--0p5 vads-u-margin-y--1"
        tabIndex="-1"
      >
        {handleNumberOfResults()} for
        {` `}
        <b>
          {representativeType}
          {` `}
        </b>
        {repOrgName && (
          <>
            matching <b>"{repOrgName}"</b>
          </>
        )}
        {address && (
          <>
            &nbsp;within 50 miles of &quot;
            <b>{address}</b>
            &quot;
          </>
        )}{' '}
      </h2>
    </div>
  );
};

SearchResultsHeader.propTypes = {
  results: PropTypes.array,
  representativeType: PropTypes.string,
  context: PropTypes.string,
};

// Only re-render if results or inProgress props have changed
const areEqual = (prevProps, nextProps) => {
  return (
    nextProps.searchResults === prevProps.searchResults &&
    nextProps.inProgress === prevProps.inProgress
  );
};

const mapStateToProps = state => ({
  ...state,
});

export default React.memo(
  connect(mapStateToProps)(SearchResultsHeader),
  areEqual,
);
