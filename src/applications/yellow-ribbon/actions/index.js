// Dependencies.
import URLSearchParams from 'url-search-params';
// Relative imports.
import { fetchResultsApi } from '../api';
import {
  FETCH_RESULTS,
  FETCH_RESULTS_FAILURE,
  FETCH_RESULTS_SUCCESS,
  TOGGLE_SHOW_MOBILE_FORM,
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
// Toggle showMobileForm
// ============
export const toggleShowMobileFormAction = () => ({
  type: TOGGLE_SHOW_MOBILE_FORM,
});

// ============
// Redux Thunks
// ============
export const fetchResultsThunk = (options = {}) => async dispatch => {
  // Derive options properties.
  const city = options?.city || null;
  const contributionAmount = options?.contributionAmount || null;
  const hideFetchingState = options?.hideFetchingState;
  const history = options?.history || window.history;
  const location = options?.location || window.location;
  const name = options?.name || null;
  const numberOfStudents = options?.numberOfStudents || null;
  const page = options?.page || 1;
  const perPage = options?.perPage || 10;
  const state = options?.state || null;

  const queryParamsLookup = {
    city,
    contributionAmount,
    name,
    numberOfStudents,
    state,
  };

  // Change the `fetching` state in our store.
  dispatch(
    fetchResultsAction({
      ...queryParamsLookup,
      hideFetchingState,
      page,
    }),
  );

  // Derive the current query params.
  const queryParams = new URLSearchParams(location.search);

  // Set/Delete query params.
  Object.keys(queryParamsLookup).forEach(key => {
    // Derive the value.
    const value = queryParamsLookup[key];

    // Set the query param.
    if (value) {
      queryParams.set(key, value);
      return;
    }

    // Remove the query param.
    queryParams.delete(key);
  });

  // Update the URL with the new query params.
  history.replaceState({}, '', `${location.pathname}?${queryParams}`);

  try {
    // Attempt to make the API request to retreive results.
    const response = await fetchResultsApi({
      city,
      contributionAmount,
      name,
      numberOfStudents,
      page,
      perPage,
      state,
    });

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
