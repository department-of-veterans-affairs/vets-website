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
  TOGGLE_TOOL_TIP,
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
// Toggle alert tool tip
// ============
export const toggleSearchResultsToolTip = () => ({ type: TOGGLE_TOOL_TIP });

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
        event: 'view_search_results',
        'search-page-path': '/education/yellow-ribbon-participating-schools/',
        'search-query': name,
        'search-typeahead-enabled': false,
        'search-location': 'Yellow Ribbon',
        'search-selection': 'Yellow Ribbon',
        'search-filters-list': {
          stateOrTerritory: state || undefined,
          city: city || undefined,
          contributionAmount: contributionAmount || undefined,
          numberOfStudents: numberOfStudents || undefined,
        },
        'search-results-total-count': response.totalResults,
        'search-results-total-pages': Math.ceil(
          response.totalResults / perPage,
        ),
        'sitewide-search-app-used': false,
        'type-ahead-option-keyword-selected': undefined,
        'type-ahead-option-position': undefined,
        'type-ahead-options-list': undefined,
        'type-ahead-options-count': undefined,
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
