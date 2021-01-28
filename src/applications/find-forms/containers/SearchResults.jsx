// Dependencies.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
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
import { getFindFormsAppState, mvpEnhancements } from '../helpers/selectors';
import { SORT_OPTIONS } from '../constants';
import SearchResult from '../components/SearchResult';

export const MAX_PAGE_LIST_LENGTH = 10;
export class SearchResults extends Component {
  static propTypes = {
    // From mapStateToProps.
    error: PropTypes.string.isRequired,
    fetching: PropTypes.bool.isRequired,
    page: PropTypes.number.isRequired,
    query: PropTypes.string.isRequired,
    results: PropTypes.arrayOf(customPropTypes.Form.isRequired),
    hasOnlyRetiredForms: PropTypes.bool.isRequired,
    sortByPropertyName: PropTypes.string,
    startIndex: PropTypes.number.isRequired,
    // From mapDispatchToProps.
    updateSortByPropertyName: PropTypes.func,
    updatePagination: PropTypes.func.isRequired,
  };

  componentDidUpdate(previousProps) {
    const { props } = this;
    const justRefreshed = previousProps.fetching && !props.fetching;

    if (justRefreshed) {
      focusElement('[data-forms-focus]');
    }
  }

  onPageSelect = page => {
    const { results, updatePagination } = this.props;

    // Derive the new start index.
    let startIndex = page * MAX_PAGE_LIST_LENGTH - MAX_PAGE_LIST_LENGTH;

    // Ensure the start index is not greater than the total amount of results.
    if (startIndex >= results.length) {
      startIndex = results.length - 1;
    }

    // Update the page and the new start index.
    updatePagination(page, startIndex);

    focusElement('[data-forms-focus]');
  };

  setSortByPropertyNameState = formMetaInfo => state => {
    if (state?.value) {
      this.props.updateSortByPropertyName(state.value, this.props.results);

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

  render() {
    const { onPageSelect, setSortByPropertyNameState } = this;
    const {
      error,
      fetching,
      page,
      query,
      results,
      sortByPropertyName,
      hasOnlyRetiredForms,
      showFindFormsResultsLinkToFormDetailPages,
      startIndex,
    } = this.props;

    // Show loading indicator if we are fetching.
    if (fetching) {
      return <LoadingIndicator setFocus message="Loading search results..." />;
    }

    // Show the error alert box if there was an error.
    if (error) {
      return (
        <AlertBox
          headline="Something went wrong"
          content={error}
          status="error"
        />
      );
    }

    // Do not render if we have not fetched, yet.
    if (!results) {
      return null;
    }

    // Show UX friendly message if all forms are tombstone/ deleted in the results returned.
    if (hasOnlyRetiredForms)
      return (
        <h2
          className="vads-u-font-size--base vads-u-line-height--3 vads-u-font-family--sans
    vads-u-margin-top--1p5 vads-u-font-weight--normal"
          data-forms-focus
        >
          The form you're looking for has been retired or is no longer valid,
          and has been removed from the VA forms database.
        </h2>
      );

    // Show no results found message.
    if (!results.length) {
      return (
        <h2
          className="vads-u-font-size--base vads-u-line-height--3 vads-u-font-family--sans
        vads-u-margin-top--1p5 vads-u-font-weight--normal"
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
        </h2>
      );
    }

    // Derive the last index.
    const lastIndex = startIndex + MAX_PAGE_LIST_LENGTH;

    // Derive the display labels.
    const startLabel = startIndex + 1;
    const lastLabel =
      lastIndex + 1 > results.length ? results.length : lastIndex;

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
        />
      ));

    return (
      <>
        <div className="find-forms-search-metadata vads-u-display--flex vads-u-flex-direction--column medium-screen:vads-u-flex-direction--row medium-screen:vads-u-justify-content--space-between">
          <h2
            className="vads-u-font-size--base vads-u-line-height--3 vads-u-font-family--sans vads-u-font-weight--normal vads-u-margin-y--1p5"
            data-forms-focus
          >
            Showing <strong>{startLabel}</strong> &ndash;{' '}
            <strong>{lastLabel}</strong> of <strong>{results.length}</strong>{' '}
            results for "<strong>{query}</strong>"
          </h2>

          {/* SORT WIDGET */}
          {showFindFormsResultsLinkToFormDetailPages && (
            <Select
              additionalClass="find-forms-search--sort-select"
              label="Sort By"
              includeBlankOption={false}
              name="findFormsSortBySelect"
              onValueChange={setSortByPropertyNameState(formMetaInfo)}
              options={SORT_OPTIONS}
              value={{ value: sortByPropertyName }}
            />
          )}
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
  }
}

const mapStateToProps = state => ({
  error: getFindFormsAppState(state).error,
  fetching: getFindFormsAppState(state).fetching,
  hasOnlyRetiredForms: getFindFormsAppState(state).hasOnlyRetiredForms,
  sortByPropertyName: getFindFormsAppState(state).sortByPropertyName,
  page: getFindFormsAppState(state).page,
  query: getFindFormsAppState(state).query,
  results: getFindFormsAppState(state).results,
  showFindFormsResultsLinkToFormDetailPages: mvpEnhancements(state),
  startIndex: getFindFormsAppState(state).startIndex,
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
