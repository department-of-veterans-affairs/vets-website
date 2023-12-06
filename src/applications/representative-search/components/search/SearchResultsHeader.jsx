import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { individualSortOptions, orgSortOptions } from '../../config';

/* eslint-disable camelcase */

export const SearchResultsHeader = props => {
  const { searchResults, pagination, query } = props;

  const { inProgress, context, representativeType, sortType } = query;
  const { totalEntries, currentPage, totalPages } = pagination;

  const noResultsFound = !searchResults || !searchResults.length;

  const sortOptions =
    representativeType === 'organization'
      ? orgSortOptions
      : individualSortOptions;

  if (inProgress || !context) {
    return <div style={{ height: '38px' }} />;
  }

  const repFormat = {
    organization: 'Veteran Service Organizations',
    attorney: 'Attorneys',
    claim_agents: 'Claim Agents',
  };

  const handleNumberOfResults = () => {
    if (noResultsFound) {
      return 'No results found';
    }
    if (totalEntries === 1) {
      return 'Showing 1 result';
    }
    if (totalEntries < 11 && totalEntries > 1) {
      return `Showing ${totalEntries} results`;
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

  const options = Object.keys(sortOptions).map(option => (
    <option key={option} value={option}>
      {sortOptions[option]}
    </option>
  ));

  // method for triggering sortResults when sortType updates
  const handleSortTypeChange = e => {
    props.updateSearchQuery({
      id: Date.now(),
      page: 1,
      sortType: e.target.value,
    });
  };

  return (
    <div className="search-results-header">
      <h2
        id="search-results-subheader"
        className="vads-u-font-family--sans vads-u-font-weight--normal vads-u-font-size--base vads-u-padding--0p5 vads-u-margin-y--1"
        tabIndex="-1"
      >
        {handleNumberOfResults()} for
        {` `}
        <b>{repFormat[representativeType]}</b>
        {context.repOrgName && (
          <>
            {` `}
            matching <b>"{context.repOrgName}"</b>
          </>
        )}
        {` `}
        {context.location && (
          <>
            within 50 miles of &quot;
            <b>{context.location}</b>
            &quot;
          </>
        )}
      </h2>
      <div className="sort-dropdown">
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
      </div>
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
