// Dependencies.
import recordEvent from 'platform/monitoring/record-event';
// Relative imports.
import { fetchResultsApi } from '../api';
import { updateQueryParams } from '../helpers';
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
  const history = options?.history;
  const location = options?.location;
  const name = options?.name || null;
  const numberOfStudents = options?.numberOfStudents || null;
  const page = options?.page || 1;
  const perPage = options?.perPage || 10;
  const state = options?.state || null;
  const trackSearch = options?.trackSearch || false;

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

  // Update query params.
  updateQueryParams(history, location, queryParamsLookup);

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

    // Track the API request.
    if (trackSearch) {
      recordEvent({
        event: 'edu-yellow-ribbon-search',
        'edu-yellow-ribbon-name': name || undefined,
        'edu-yellow-ribbon-state': state || undefined,
        'edu-yellow-ribbon-city': city || undefined,
        'edu-yellow-ribbon-contribution-amount':
          contributionAmount || undefined,
        'edu-yellow-ribbon-number-of-students': numberOfStudents || undefined,
        'edu-yellow-ribbon-number-of-search-results': response?.totalResults,
      });
    }

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
