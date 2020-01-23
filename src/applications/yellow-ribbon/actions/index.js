// Dependencies.
import URLSearchParams from 'url-search-params';
// Relative imports.
import { fetchResultsApi } from '../api';
import {
  FETCH_RESULTS,
  FETCH_RESULTS_FAILURE,
  FETCH_RESULTS_SUCCESS,
} from '../constants';

// ============
// Fetch Results (via API)
// ============
export const fetchResultsAction = (options = {}) => ({
  options,
  type: FETCH_RESULTS,
});

export const fetchResultsFailure = error => ({
  error,
  type: FETCH_RESULTS_FAILURE,
});

export const fetchResultsSuccess = response => ({
  response,
  type: FETCH_RESULTS_SUCCESS,
});

// ============
// Redux Thunks
// ============
export const fetchResultsThunk = (options = {}) => async dispatch => {
  // Derive options properties.
  const history = options?.history || window.history;
  const location = options?.location || window.location;
  const mockRequest = options?.mockRequest || false;
  const name = options?.name || '';
  const state = options?.state || '';

  // Change the `fetching` state in our store.
  dispatch(fetchResultsAction({ name, state }));

  // Derive the current query params.
  const queryParams = new URLSearchParams(location.search);

  // Update the query params in our URL.
  queryParams.set('name', name);
  queryParams.set('state', state);

  // Update the URL with the new query params.
  history.replaceState({}, '', `${location.pathname}?${queryParams}`);

  try {
    // Attempt to make the API request to retreive results.
    const response = await fetchResultsApi({ mockRequest, name, state });

    // If we are here, the API request succeeded.
    dispatch(fetchResultsSuccess(response));
  } catch (error) {
    console.log('error', error);
    // If we are here, the API request failed.
    dispatch(
      fetchResultsFailure(
        'We’re sorry. Something went wrong on our end. Please try again later.',
      ),
    );
  }
};
