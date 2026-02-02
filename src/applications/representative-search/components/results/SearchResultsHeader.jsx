import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles/useFeatureToggle';
import { sortOptions } from '../../config';

/* eslint-disable camelcase */
/* eslint-disable @department-of-veterans-affairs/prefer-button-component */

export const SearchResultsHeader = props => {
  const { searchResults, pagination, query } = props;
  const { inProgress } = query;
  const {
    context,
    representativeType,
    sortType,
    searchArea,
  } = query.committedSearchQuery;
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();

  const reportFeatureEnabled = useToggleValue(
    TOGGLE_NAMES.findARepresentativeFlagResultsEnabled,
  );
  const { totalEntries, currentPage, totalPages } = pagination;
  const noResultsFound = !searchResults || !searchResults?.length;

  const [selectedSortType, setSelectedSortType] = useState(sortType);

  if (inProgress || !context) {
    return <div style={{ height: '38px' }} />;
  }

  const repFormat = {
    veteran_service_officer: 'Accredited VSO Representative',
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
    const queryUpdateCommitPayload = {
      id: Date.now(),
      page: 1,
      sortType: selectedSortType,
    };

    props.updateSearchQuery(queryUpdateCommitPayload);
    props.commitSearchQuery(queryUpdateCommitPayload);
  };

  return (
    <div className="search-results-header vads-u-margin-bottom--5 vads-u-margin-padding-x--5">
      {/* Trigger methods for unit testing - temporary workaround for shadow root issues */}
      {props.onClickApplyButtonTester ? (
        <button
          id="test-button"
          label="test-button"
          type="button"
          text-label="button"
          onClick={onClickApplyButton}
        />
      ) : null}
      <h2 className="vads-u-margin-y--1">Your search results</h2>
      <div className="vads-u-margin-top--3">
        {searchResults?.length ? (
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
                accredited representatives.{' '}
                {reportFeatureEnabled
                  ? `You can report outdated information
                in your search results.`
                  : null}
              </p>
            </va-alert>
          </div>
        ) : null}

        <p
          id="search-results-subheader"
          className="vads-u-font-family--sans vads-u-font-weight--normal vads-u-margin-bottom--0 vads-u-margin-top--3"
          tabIndex="-1"
        >
          {handleNumberOfResults()} for
          {` `}
          <b>{repFormat[representativeType]}</b>
          {context.repOrgName && (
            <>
              {` `}
              named
              {` `}
              <b>{context.repOrgName}</b>
            </>
          )}
          {` `}
          {context.location && (
            <>
              within
              {` `}
              <b>
                {searchArea === 'Show all' ? (
                  'Show all'
                ) : (
                  <>{searchArea} miles</>
                )}
              </b>
              {` `}
              of
              {` `}
              <b>{context.location}</b>{' '}
            </>
          )}
          <>
            sorted by
            {` `}
            <b>{sortOptions[sortType]}</b>
          </>
        </p>

        {noResultsFound ? (
          <p className="vads-u-margin-bottom--8">
            For better results, try increasing your <b>search area</b>.
          </p>
        ) : (
          <div className="sort-dropdown">
            <div className="sort-select-and-apply">
              <div className="sort-select">
                <VaSelect
                  name="sort"
                  value={selectedSortType}
                  label="Sort by"
                  onVaSelect={e => {
                    setSelectedSortType(e.target.value || options[0].key);
                  }}
                  uswds
                >
                  {options}
                </VaSelect>
              </div>

              <div className="sort-apply-button">
                <va-button onClick={onClickApplyButton} text="Sort" secondary />
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
    searchArea: PropTypes.any,
    sortType: PropTypes.string,
  }),
  searchResults: PropTypes.array,
  updateSearchQuery: PropTypes.func,
  commitSearchQuery: PropTypes.func,
  onClickApplyButtonTester: PropTypes.func,
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
