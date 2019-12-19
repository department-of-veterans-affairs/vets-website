// Dependencies.
import URLSearchParams from 'url-search-params';
// Relative imports.
import { fetchFormsApi } from '../api';
import {
  FETCH_FORMS,
  FETCH_FORMS_FAILURE,
  FETCH_FORMS_SUCCESS,
  UPDATE_RESULTS,
} from '../constants';

// ============
// Fetch Forms (via API)
// ============
export const fetchFormsAction = query => ({
  query,
  type: FETCH_FORMS,
});

export const fetchFormsFailure = () => ({
  type: FETCH_FORMS_FAILURE,
});

export const fetchFormsSuccess = results => ({
  results,
  type: FETCH_FORMS_SUCCESS,
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
export const fetchFormsThunk = (
  query,
  location = window.location,
  history = window.history,
) => async dispatch => {
  // Change the `fetching` state in our store.
  dispatch(fetchFormsAction(query));

  // Derive the current query params.
  const queryParams = new URLSearchParams(location.search);

  // Update the query params with the new `query`.
  queryParams.set('q', query);

  // Update the URL with the new query param.
  history.replaceState({}, '', `${location.pathname}?${queryParams}`);

  try {
    // Attempt to make the API request to retreive forms.
    const results = await fetchFormsApi(URL, query);

    // If we are here, the API request succeeded.
    dispatch(fetchFormsSuccess(results));
  } catch (error) {
    // If we are here, the API request failed.
    dispatch(fetchFormsFailure());
  }
};
