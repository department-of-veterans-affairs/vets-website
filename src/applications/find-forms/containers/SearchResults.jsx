// Dependencies.
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import Pagination from '@department-of-veterans-affairs/component-library/Pagination';
import { connect } from 'react-redux';
import Select from '@department-of-veterans-affairs/component-library/Select';

// Relative imports.
import recordEvent from 'platform/monitoring/record-event';
import { focusElement } from 'platform/utilities/ui';
import * as customPropTypes from '../prop-types';
import {
  updateSortByPropertyNameThunk,
  updatePaginationAction,
} from '../actions';
import {
  getFindFormsAppState,
  applyLighthouseFormsSearchLogic,
  applySearchUIUXEnhancements,
} from '../helpers/selectors';
import { FAF_SORT_OPTIONS, FAF_TEST_OPTION_CLOSEST_MATCH } from '../constants';
import SearchResult from '../components/SearchResult';

export const MAX_PAGE_LIST_LENGTH = 10;
const usePreviousProps = value => {
  // This is a mirror to storing and assessing prevProps vs current props
  const ref = useRef(); // Refs are like a class instance var, in react their values don't change unless that same ref is redefined.
  useEffect(() => {
    // This hook is run ONLY after the return statement of the component is evaluated (ComponentDidMount || Update)
    ref.current = value;
  });
  return ref.current; // Returns the value BEFORE the return statement of the component is evaluated.
};
/** How it works ^
 * Essentially it's step by step.
 * 1. Init of SearchResults which calls usePreviousProps() defining the REF. (Ignores UseEffect because component is not rendered yet)
 * 2. SearchResults return statement is evaluated.
 * 3. (CDM) UseEffects is evoked and the variables are assessed. PrevProps is still the same as when it was evoked during step 1.
 * 4. Consumer fills in the search bar and hits search. That updates Redux which returns NEW Props to component.
 * 5. (CDU) usePreviousProps(newProps) is invoked; it returns the value of the REF from step 1 is return as it is the "Previous Props".
 * 6. #2 is repeated.
 * 7. (CDU) UseEffects is evoked and the variables are assessed. PrevProps is still the same as when it was evoked during step 1. However, the "newProps" from step #5 will now be the new "prevProps" and the REF Value is overwritten.
 * 8. Repeat
 */

export const SearchResults = ({
  error,
  fetching,
  page,
  query,
  results,
  sortByPropertyName,
  hasOnlyRetiredForms,
  startIndex,
  useLighthouseSearchAlgo,
  updatePagination,
  updateSortByPropertyName,
  useSearchUIUXEnhancements,
}) => {
  const prevProps = usePreviousProps({
    fetching,
    useLighthouseSearchAlgo,
  });

  useEffect(() => {
    const justRefreshed = prevProps?.fetching && !fetching;
    if (justRefreshed) {
      focusElement('[data-forms-focus]');
    }

    // NOTE: This is only for testing Lighthouse Search Algorithm
    if (
      prevProps?.useLighthouseSearchAlgo === undefined &&
      useLighthouseSearchAlgo === true
    ) {
      updateSortByPropertyName(FAF_TEST_OPTION_CLOSEST_MATCH, results);
    }
  });

  const onPageSelect = p => {
    // Derive the new start index.
    let startIn = p * MAX_PAGE_LIST_LENGTH - MAX_PAGE_LIST_LENGTH;

    // Ensure the start index is not greater than the total amount of results.
    if (startIn >= results.length) {
      startIn = results.length - 1;
    }

    // Update the page and the new start index.
    updatePagination(p, startIn);

    focusElement('[data-forms-focus]');
  };

  const setSortByPropertyNameState = formMetaInfo => state => {
    if (state?.value) {
      updateSortByPropertyName(state.value, results);

      recordEvent({
        event: 'onsite-search-results-change',
        'search-query': formMetaInfo?.query, // dynamically populate with the search query
        'search-page-path': '/find-forms', // consistent for all search results from this page
        'search-results-change-action-type': 'sort', // will consistently classify these actions as 'sort', leaves the door open for other search enhancements to user "filter"
        'search-results-change-action-label': state.value, // 'oldest' // populate according to user selection
        'search-results-pagination-current-page': formMetaInfo?.currentPage, // populate with the current pagination number
        'search-results-total-count': formMetaInfo?.totalResultsCount, // populate with the total number of search results
        'search-results-total-pages': formMetaInfo?.totalResultsPages, // populate with total number of result pages
      });
    }
  };

  // Show loading indicator if we are fetching.
  if (fetching) {
    return <LoadingIndicator setFocus message="Loading search results..." />;
  }

  // Show the error alert box if there was an error.
  if (error) {
    return (
      <va-alert status="error">
        <h3 slot="headline">Something went wrong</h3>
        <div className="usa-alert-text vads-u-font-size--base">{error}</div>
      </va-alert>
    );
  }

  // Do not render if we have not fetched, yet.
  if (!results) {
    return null;
  }

  // Show UX friendly message if all forms are tombstone/ deleted in the results returned.
  if (hasOnlyRetiredForms)
    return (
      <p
        className="vads-u-font-size--base vads-u-line-height--3 vads-u-font-family--sans
    vads-u-margin-top--1p5 vads-u-font-weight--normal va-u-outline--none"
        data-forms-focus
      >
        The form you're looking for has been retired or is no longer valid, and
        has been removed from the VA forms database.
      </p>
    );

  // Show no results found message.
  if (!results.length) {
    return (
      <p
        className="vads-u-font-size--base vads-u-line-height--3 vads-u-font-family--sans
        vads-u-margin-top--1p5 vads-u-font-weight--normal va-u-outline--none"
        data-forms-focus
      >
        No results were found for "<strong>{query}</strong>
        ." Try using fewer words or broadening your search. If you&apos;re
        looking for non-VA forms, go to the{' '}
        <a
          href="https://www.gsa.gov/reference/forms"
          rel="noopener noreferrer"
          target="_blank"
        >
          GSA Forms Library
        </a>
        .
      </p>
    );
  }

  // Derive sort options
  const DEFAULT_SORT_OPTIONS = useLighthouseSearchAlgo
    ? [FAF_TEST_OPTION_CLOSEST_MATCH, ...FAF_SORT_OPTIONS]
    : FAF_SORT_OPTIONS;

  // Derive the last index.
  const lastIndex = startIndex + MAX_PAGE_LIST_LENGTH;

  // Derive the display labels.
  const startLabel = startIndex + 1;
  const lastLabel = lastIndex + 1 > results.length ? results.length : lastIndex;

  // Derive the total number of pages.
  const totalPages = Math.ceil(results.length / MAX_PAGE_LIST_LENGTH);

  const formMetaInfo = {
    query,
    currentPage: page,
    totalResultsCount: results.length,
    totalResultsPages: totalPages,
  };

  const searchResults = results
    .slice(startIndex, lastIndex)
    .map((form, index) => (
      <SearchResult
        key={form.id}
        form={form}
        formMetaInfo={{ ...formMetaInfo, currentPositionOnPage: index + 1 }}
        useSearchUIUXEnhancements={useSearchUIUXEnhancements}
      />
    ));

  return (
    <>
      <div className="find-forms-search-metadata vads-u-display--flex vads-u-flex-direction--column medium-screen:vads-u-flex-direction--row medium-screen:vads-u-justify-content--space-between">
        <h2
          className="vads-u-font-size--md vads-u-line-height--3 vads-u-font-family--sans vads-u-font-weight--normal vads-u-margin-y--1p5 va-u-outline--none"
          data-forms-focus
        >
          {/* eslint-disable-next-line jsx-a11y/aria-role */}
          <span role="text">
            {useSearchUIUXEnhancements ? (
              <>
                Showing <span>{startLabel}</span> &ndash;{' '}
                <span>{lastLabel}</span> of <span>{results.length}</span>{' '}
                results for "{' '}
              </>
            ) : (
              <>
                Showing{' '}
                <span className="vads-u-font-weight--bold">{startLabel}</span>{' '}
                &ndash;{' '}
                <span className="vads-u-font-weight--bold">{lastLabel}</span> of{' '}
                <span className="vads-u-font-weight--bold">
                  {results.length}
                </span>{' '}
                results for "{' '}
              </>
            )}
            <span className="vads-u-font-weight--bold">{query}</span>"
          </span>
        </h2>

        {/* SORT WIDGET */}
        <Select
          additionalClass="find-forms-search--sort-select"
          label="Sort By"
          includeBlankOption={false}
          name="findFormsSortBySelect"
          onValueChange={setSortByPropertyNameState(formMetaInfo)}
          options={DEFAULT_SORT_OPTIONS}
          value={{ value: sortByPropertyName }}
        />
      </div>

      <dl className="vads-l-grid-container--full">{searchResults}</dl>

      {/* Pagination Row */}
      {results.length > MAX_PAGE_LIST_LENGTH && (
        <Pagination
          className="find-va-froms-pagination-override"
          maxPageListLength={MAX_PAGE_LIST_LENGTH}
          onPageSelect={onPageSelect}
          page={page}
          pages={totalPages}
          showLastPage
        />
      )}
    </>
  );
};

SearchResults.propTypes = {
  // From mapStateToProps.
  error: PropTypes.string.isRequired,
  fetching: PropTypes.bool.isRequired,
  page: PropTypes.number.isRequired,
  query: PropTypes.string.isRequired,
  results: PropTypes.arrayOf(customPropTypes.Form.isRequired),
  hasOnlyRetiredForms: PropTypes.bool.isRequired,
  sortByPropertyName: PropTypes.string,
  startIndex: PropTypes.number.isRequired,
  useLighthouseSearchAlgo: PropTypes.bool,
  // From mapDispatchToProps.
  updateSortByPropertyName: PropTypes.func,
  updatePagination: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  error: getFindFormsAppState(state).error,
  fetching: getFindFormsAppState(state).fetching,
  hasOnlyRetiredForms: getFindFormsAppState(state).hasOnlyRetiredForms,
  sortByPropertyName: getFindFormsAppState(state).sortByPropertyName,
  page: getFindFormsAppState(state).page,
  query: getFindFormsAppState(state).query,
  results: getFindFormsAppState(state).results,
  startIndex: getFindFormsAppState(state).startIndex,
  useLighthouseSearchAlgo: applyLighthouseFormsSearchLogic(state),
  useSearchUIUXEnhancements: applySearchUIUXEnhancements(state),
});

const mapDispatchToProps = dispatch => ({
  updateSortByPropertyName: (sortByPropertyName, results) =>
    dispatch(updateSortByPropertyNameThunk(sortByPropertyName, results)),
  updatePagination: (page, startIndex) =>
    dispatch(updatePaginationAction(page, startIndex)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchResults);
