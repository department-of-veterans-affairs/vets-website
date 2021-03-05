// Dependencies.
import URLSearchParams from 'url-search-params';
// Relative imports.
import { fetchFormsApi } from '../api';
import { transformSearchTerm } from '../helpers';
import {
  FETCH_FORMS,
  FETCH_FORMS_FAILURE,
  FETCH_FORMS_SUCCESS,
  UPDATE_HOW_TO_SORT,
  UPDATE_PAGINATION,
  UPDATE_RESULTS,
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

// =============
// Update Results after forms is sorted
// =============
export const updateResults = results => ({
  results,
  type: UPDATE_RESULTS,
});

// =============
// Update How To Sort
// =============
export const updateSortByPropertyName = sortByPropertyName => ({
  sortByPropertyName,
  type: UPDATE_HOW_TO_SORT,
});

export const updateSortByPropertyNameThunk = (
  sortByPropertyName,
  results,
) => dispatch => {
  dispatch(updateSortByPropertyName(sortByPropertyName));
  dispatch(updateResults(results));
};

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
export const fetchFormsThunk = (query, options = {}) => async dispatch => {
  // Derive options properties.
  const location = options?.location || window.location;
  const history = options?.history || window.history;
  const mockRequest = options?.mockRequest || false;
  const q = transformSearchTerm(query);

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
    const resultsDetails = await fetchFormsApi(q, { mockRequest });

    // If we are here, the API request succeeded.
    dispatch(
      fetchFormsSuccess(
        resultsDetails.results,
        resultsDetails.hasOnlyRetiredForms,
      ),
    );
  } catch (error) {
    // If we are here, the API request failed.
    dispatch(
      fetchFormsFailure(
        'We’re sorry. Something went wrong on our end. Please try again later.',
      ),
    );
  }
};
