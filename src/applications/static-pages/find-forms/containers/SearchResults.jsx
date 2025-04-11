import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  VaPagination,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import recordEvent from 'platform/monitoring/record-event';
import { focusElement } from 'platform/utilities/ui';
import {
  updateSortByPropertyNameThunk,
  updatePaginationAction,
} from '../actions';
import { FAF_SORT_OPTIONS, MAX_PAGE_LIST_LENGTH } from '../constants';
import SearchResult from '../components/SearchResult';
import DownloadModal from '../components/DownloadModal';
import { FormTypes } from '../types';

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
  updatePagination,
  updateSortByPropertyName,
}) => {
  const prevProps = usePreviousProps({
    fetching,
  });

  const initialModalState = {
    formId: null,
    formName: null,
    formUrl: null,
    isOpen: false,
  };

  const [modalState, setModalState] = useState(initialModalState);
  const dd214Matcher = new RegExp(/dd-?214/i);
  const queryIsDd214 = dd214Matcher.test(query);

  useEffect(() => {
    const justRefreshed = prevProps?.fetching && !fetching;
    if (justRefreshed) {
      focusElement('[data-forms-focus]');
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
        'search-query': formMetaInfo?.query,
        'search-page-path': '/find-forms',
        'search-results-change-action-type': 'sort',
        'search-results-change-action-label': state.value,
        'search-results-pagination-current-page': formMetaInfo?.currentPage,
        'search-results-total-count': formMetaInfo?.totalResultsCount,
        'search-results-total-pages': formMetaInfo?.totalResultsPages,
      });
    }
  };

  if (fetching) {
    return (
      <va-loading-indicator set-focus message="Loading search results..." />
    );
  }

  if (error) {
    return (
      <va-alert status="error">
        <h3 slot="headline">Something went wrong</h3>
        {error}
      </va-alert>
    );
  }

  if (!results) {
    return null;
  }

  // Show UX friendly message if all forms are tombstone/ deleted in the results returned.
  if (hasOnlyRetiredForms) {
    return (
      <p
        className="vads-u-font-size--base vads-u-line-height--3 vads-u-font-family--sans
    vads-u-margin-top--1p5 vads-u-font-weight--normal va-u-outline--none"
        data-forms-focus
      >
        The form you’re looking for has been retired or is no longer valid, and
        has been removed from the VA forms database.
      </p>
    );
  }

  if (!results.length) {
    return (
      <>
        <p
          className="vads-u-line-height--3 vads-u-margin-top--1p5 va-u-outline--none"
          data-e2e-id="ff-no-results"
          data-forms-focus
        >
          No results were found for "<strong>{query}</strong>
          ." Try using fewer words or broadening your search. If you’re looking
          for non-VA forms, go to the{' '}
          <va-link
            href="https://www.gsa.gov/reference/forms"
            text="GSA Forms Library"
          />
          .
        </p>
        {queryIsDd214 && (
          <p>
            <va-link
              data-e2e-id="ff-no-results-dd214"
              href="https://www.va.gov/records/get-military-service-records/"
              text="Need to request your military records including DD214?"
            />
          </p>
        )}
      </>
    );
  }

  const lastIndex = startIndex + MAX_PAGE_LIST_LENGTH;

  const startLabel = startIndex + 1;
  const lastLabel = lastIndex + 1 > results.length ? results.length : lastIndex;
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
        setModalState={setModalState}
      />
    ));

  const closeModal = () => {
    if (modalState?.pdfId) {
      const lastDownloadLinkClicked = document.getElementById(modalState.pdf);
      focusElement(lastDownloadLinkClicked);
    }

    setModalState(initialModalState);
  };

  return (
    <>
      <div className="find-forms-search-metadata vads-u-display--flex vads-u-flex-direction--column medium-screen:vads-u-flex-direction--row medium-screen:vads-u-justify-content--space-between">
        <h2
          className="vads-u-font-size--md vads-u-line-height--3 vads-u-font-family--sans vads-u-font-weight--normal vads-u-margin-y--1p5 va-u-outline--none"
          data-forms-focus
        >
          <span role="text">
            <>
              Showing <span>{startLabel}</span> &ndash; <span>{lastLabel}</span>{' '}
              of <span>{results.length}</span> results for "
            </>
            <span className="vads-u-font-weight--bold">{query}</span>"
          </span>
        </h2>

        {/* SORT WIDGET */}
        <VaSelect
          label="Sort By"
          name="findFormsSortBySelect"
          onVaSelect={({ detail: value }) => {
            setSortByPropertyNameState(formMetaInfo)(value);
          }}
          value={sortByPropertyName}
        >
          {FAF_SORT_OPTIONS.map(opt => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </VaSelect>
      </div>

      <ul className="vads-l-grid-container--full usa-unstyled-list vads-u-margin-top--2">
        {searchResults}
      </ul>

      {/* Download PDF modal */}
      <div className="pdf-alert-modal">
        <DownloadModal
          closeModal={closeModal}
          formName={modalState?.formName}
          formUrl={modalState?.formUrl}
          isOpen={modalState.isOpen}
        />
      </div>

      {/* Pagination Row */}
      {results.length > MAX_PAGE_LIST_LENGTH && (
        <VaPagination
          className="find-va-forms-pagination-override"
          maxPageListLength={MAX_PAGE_LIST_LENGTH}
          onPageSelect={e => onPageSelect(e.detail.page)}
          page={page}
          pages={totalPages}
          showLastPage
        />
      )}
    </>
  );
};

SearchResults.propTypes = {
  error: PropTypes.string.isRequired,
  fetching: PropTypes.bool.isRequired,
  hasOnlyRetiredForms: PropTypes.bool.isRequired,
  page: PropTypes.number.isRequired,
  query: PropTypes.string.isRequired,
  startIndex: PropTypes.number.isRequired,
  updatePagination: PropTypes.func.isRequired,
  results: PropTypes.arrayOf(FormTypes),
  sortByPropertyName: PropTypes.string,
  updateSortByPropertyName: PropTypes.func,
};

const mapStateToProps = state => ({
  error: state.findVAFormsReducer.error,
  fetching: state.findVAFormsReducer.fetching,
  hasOnlyRetiredForms: state.findVAFormsReducer.hasOnlyRetiredForms,
  sortByPropertyName: state.findVAFormsReducer.sortByPropertyName,
  page: state.findVAFormsReducer.page,
  query: state.findVAFormsReducer.query,
  results: state.findVAFormsReducer.results,
  startIndex: state.findVAFormsReducer.startIndex,
});

const mapDispatchToProps = dispatch => ({
  updateSortByPropertyName: (sortByPropertyName, results) =>
    dispatch(updateSortByPropertyNameThunk(sortByPropertyName, results)),
  updatePagination: (page, startIndex) =>
    dispatch(updatePaginationAction(page, startIndex)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchResults);
