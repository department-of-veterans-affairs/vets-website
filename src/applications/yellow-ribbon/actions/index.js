// Dependencies.
import URLSearchParams from 'url-search-params';
// Relative imports.
import { fetchResultsApi } from '../api';
import {
  FETCH_RESULTS,
  FETCH_RESULTS_FAILURE,
  FETCH_RESULTS_SUCCESS,
  UPDATE_PAGINATION,
  UPDATE_RESULTS,
} from '../constants';

// ============
// Fetch Results (via API)
// ============
export const fetchResultsAction = query => ({
  query,
  type: FETCH_RESULTS,
});

export const fetchResultsFailure = error => ({
  error,
  type: FETCH_RESULTS_FAILURE,
});

export const fetchResultsSuccess = results => ({
  results,
  type: FETCH_RESULTS_SUCCESS,
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
// Update Results (no API)
// ============
export const updateResultsAction = results => ({
  results,
  type: UPDATE_RESULTS,
});

// ============
// Redux Thunks
// ============
export const fetchResultsThunk = (query, options = {}) => async dispatch => {
  // Derive options properties.
  const location = options?.location || window.location;
  const history = options?.history || window.history;
  const mockRequest = options?.mockRequest || false;

  // Change the `fetching` state in our store.
  dispatch(fetchResultsAction(query));

  // Reset the pagination.
  dispatch(updatePaginationAction());

  // Derive the current query params.
  const queryParams = new URLSearchParams(location.search);

  // Update the query params with the new `query`.
  queryParams.set('q', query);

  // Update the URL with the new query param.
  history.replaceState({}, '', `${location.pathname}?${queryParams}`);

  try {
    // Attempt to make the API request to retreive results.
    const results = await fetchResultsApi(query, { mockRequest });

    // If we are here, the API request succeeded.
    dispatch(fetchResultsSuccess(results));
  } catch (error) {
    // If we are here, the API request failed.
    dispatch(
      fetchResultsFailure(
        'We’re sorry. Something went wrong on our end. Please try again later.',
      ),
    );
  }
};
