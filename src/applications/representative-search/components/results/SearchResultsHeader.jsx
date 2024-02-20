import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { sortOptions } from '../../config';

/* eslint-disable camelcase */

export const SearchResultsHeader = props => {
  const { searchResults, pagination, query } = props;
  const {
    inProgress,
    context,
    representativeType,
    sortType,
    searchArea,
  } = query;
  const { totalEntries, currentPage, totalPages } = pagination;
  const noResultsFound = !searchResults || !searchResults.length;

  const [selectedSortType, setSelectedSortType] = useState(sortType);

  if (inProgress || !context) {
    return <div style={{ height: '38px' }} />;
  }

  const repFormat = {
    veteran_service_officer: 'Accredited Veteran Service Officer (VSO)',
    attorney: 'Accredited attorney',
    claim_agents: 'Accredited claims agent',
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

  // selection is updated in redux
  const onClickApplyButton = () => {
    props.updateSearchQuery({
      id: Date.now(),
      page: 1,
      sortType: selectedSortType,
    });
  };

  return (
    <div className="search-results-header vads-u-margin-bottom--5 vads-u-margin-padding-x--5">
      <h2 className="vads-u-margin-y--1">Your search results</h2>
      <div className="vads-u-margin-top--3">
        <div>
          {' '}
          <va-alert
            close-btn-aria-label="Close notification"
            status="info"
            uswds
            visible
          >
            <h3 id="track-your-status-on-mobile" slot="headline">
              We’re updating our search tool
            </h3>
            <p>
              Our search tool may show outdated contact information for some
              accredited representatives. You can report outdated information in
              your search results.
            </p>
          </va-alert>
        </div>

        <p
          id="search-results-subheader"
          className="vads-u-font-family--sans vads-u-font-weight--normal vads-u-margin-bottom--0 vads-u-margin-top--3"
          tabIndex="-1"
        >
          {handleNumberOfResults()} for
          {` `}
          &quot;
          <b>{repFormat[representativeType]}</b>
          &quot;
          {context.repOrgName && (
            <>
              {` `}
              named &quot;
              <b>{context.repOrgName}</b>
              &quot;
            </>
          )}
          {` `}
          {context.location && (
            <>
              within &quot;
              <b>
                {searchArea === 'Show all' ? (
                  'Show all'
                ) : (
                  <>{searchArea} miles</>
                )}
              </b>
              &quot; of &quot;
              <b>{context.location}</b>
              &quot;
            </>
          )}
        </p>

        {noResultsFound ? (
          <p className="vads-u-margin-bottom--8">
            For better results, you can increase your <b>search area</b>.
          </p>
        ) : (
          <div className="sort-dropdown">
            <div className="sort-select-and-apply">
              <div className="sort-select">
                <VaSelect
                  name="sort"
                  value={selectedSortType}
                  label="Sort by"
                  onVaSelect={e => setSelectedSortType(e.target.value)}
                  uswds
                >
                  {options}
                </VaSelect>
              </div>

              <div className="sort-apply-button">
                <va-button
                  onClick={onClickApplyButton}
                  text="Apply"
                  secondary
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

SearchResultsHeader.propTypes = {
  pagination: PropTypes.object,
  query: PropTypes.shape({
    context: PropTypes.shape({
      repOrgName: PropTypes.string,
      location: PropTypes.string,
    }),
    inProgress: PropTypes.bool,
    representativeType: PropTypes.string,
    sortType: PropTypes.string,
  }),
  searchResults: PropTypes.array,
  updateSearchQuery: PropTypes.func,
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
