// Dependencies.
import URLSearchParams from 'url-search-params';
// Relative imports.
import recordEvent from 'platform/monitoring/record-event';
import { MAX_PAGE_LIST_LENGTH } from '../containers/SearchResults';
import { mvpEnhancements } from '../helpers/selectors';
import { fetchFormsApi } from '../api';
import {
  FETCH_FORMS,
  FETCH_FORMS_FAILURE,
  FETCH_FORMS_SUCCESS,
  UPDATE_PAGINATION,
} from '../constants';

// ============
// Fetch Forms (via API)
// ============
export const fetchFormsAction = query => ({
  query,
  type: FETCH_FORMS,
});

export const fetchFormsFailure = error => ({
  error,
  type: FETCH_FORMS_FAILURE,
});

export const fetchFormsSuccess = (results, hasOnlyRetiredForms) => ({
  results,
  hasOnlyRetiredForms,
  type: FETCH_FORMS_SUCCESS,
});

// ============
// Pagination Actions
// ============
export const updatePaginationAction = (page = 1, startIndex = 0) => ({
  page,
  startIndex,
  type: UPDATE_PAGINATION,
});

// ============
// Redux Thunks
// ============
export const fetchFormsThunk = (query, options = {}) => async (
  dispatch,
  getState,
) => {
  // Derive options properties.
  const location = options?.location || window.location;
  const history = options?.history || window.history;
  const mockRequest = options?.mockRequest || false;

  // Change the `fetching` state in our store.
  dispatch(fetchFormsAction(query));

  // Reset the pagination.
  dispatch(updatePaginationAction());

  // Derive the current query params.
  const queryParams = new URLSearchParams(location.search);

  // Update the query params with the new `query`.
  queryParams.set('q', query);

  // Update the URL with the new query param.
  history.replaceState({}, '', `${location.pathname}?${queryParams}`);

  try {
    // Attempt to make the API request to retreive forms.
    const resultsDetails = await fetchFormsApi(query, { mockRequest });

    // If we are here, the API request succeeded.
    dispatch(
      fetchFormsSuccess(
        resultsDetails.results,
        resultsDetails.hasOnlyRetiredForms,
      ),
    );

    // Derive the total number of pages.
    const totalPages = Math.ceil(
      resultsDetails.results.length / MAX_PAGE_LIST_LENGTH,
    );

    // Only record GA event if Feature flag is on
    const showFindFormsResultsLinkToFormDetailPages = mvpEnhancements(
      getState(),
    );
    if (showFindFormsResultsLinkToFormDetailPages)
      recordEvent({
        event: 'view_search_results', // remains consistent, push this event with each search
        'search-page-path': '/find-forms', // populate with '/find-forms', remains consistent for all searches from find-forms page
        'search-query': query, // populate with full query user used to execute search
        'search-results-total-count': resultsDetails?.results?.length, // populate with total number of search results returned
        'search-results-total-pages': totalPages, // populate with total number of search result pages returned
        'search-selection': 'Find forms', // populate with 'Find forms' for all searches from /find-forms page
        'search-typeahead-enabled': false, // populate with boolean false, remains consistent since type ahead won't feature here
        'type-ahead-option-keyword-selected': undefined, // populate with undefined since type ahead won't feature here
        'type-ahead-option-position': undefined, // populate with undefined since type ahead won't feature here
        'type-ahead-options-list': undefined, // populate with undefined since type ahead won't feature here
      });
  } catch (error) {
    // If we are here, the API request failed.
    dispatch(
      fetchFormsFailure(
        'We’re sorry. Something went wrong on our end. Please try again later.',
      ),
    );
  }
};
