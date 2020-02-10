// Dependencies.
import URLSearchParams from 'url-search-params';
// Relative imports.
import { fetchResultsApi } from '../api';
import {
  ADD_SCHOOL_TO_COMPARE,
  FETCH_RESULTS,
  FETCH_RESULTS_FAILURE,
  FETCH_RESULTS_SUCCESS,
  REMOVE_SCHOOL_FROM_COMPARE,
  UPDATE_PAGE,
} from '../constants';

// ============
// Add/Remove School from comparison
// ============
export const addSchoolToCompareAction = school => ({
  school,
  type: ADD_SCHOOL_TO_COMPARE,
});

export const removeSchoolFromCompareAction = school => ({
  school,
  type: REMOVE_SCHOOL_FROM_COMPARE,
});

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
// Update page
// ============
export const updatePageAction = page => ({
  page,
  type: UPDATE_PAGE,
});

// ============
// Redux Thunks
// ============
export const fetchResultsThunk = (options = {}) => async dispatch => {
  // Derive options properties.
  const history = options?.history || window.history;
  const location = options?.location || window.location;
  const name = options?.name || '';
  const page = options?.page || 1;
  const perPage = options?.perPage || 10;
  const hideFetchingState = options?.hideFetchingState;
  const state = options?.state || '';

  // Change the `fetching` state in our store.
  dispatch(fetchResultsAction({ name, hideFetchingState, state }));

  // Derive the current query params.
  const queryParams = new URLSearchParams(location.search);

  // Update the query params in our URL.
  queryParams.set('name', name);
  queryParams.set('state', state);

  // Update the URL with the new query params.
  history.replaceState({}, '', `${location.pathname}?${queryParams}`);

  try {
    // Attempt to make the API request to retreive results.
    const response = await fetchResultsApi({ name, state, page, perPage });

    // If we are here, the API request succeeded.
    dispatch(fetchResultsSuccess(response));
  } catch (error) {
    // If we are here, the API request failed.
    dispatch(
      fetchResultsFailure(
        'We’re sorry. Something went wrong on our end. Please try again later.',
      ),
    );
  }
};
