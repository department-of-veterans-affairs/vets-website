// Node modules.
// import recordEvent from 'platform/monitoring/record-event';
// Relative imports.
import { fetchResults, fetchScopes } from '../api';
import {
  FETCH_RESULTS,
  FETCH_RESULTS_FAILURE,
  FETCH_RESULTS_SUCCESS,
  FETCH_SCOPES,
  FETCH_SCOPES_FAILURE,
  FETCH_SCOPES_SUCCESS,
} from '../constants';

// ============
// Fetch Results
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
  scopeCategory,
  type: FETCH_RESULTS_SUCCESS,
});

// ============
// Fetch Scopes
// ============

export const fetchScopesAction = () => ({
  type: FETCH_SCOPES,
});

export const fetchScopesFailure = error => ({
  error,
  type: FETCH_SCOPES_FAILURE,
});

export const fetchScopesSuccess = response => ({
  response,
  type: FETCH_RESULTS_SUCCESS,
});

// ============
// Redux Thunks
// ============
export const fetchResultsThunk = options => async dispatch => {
  const { hideFetchingState, page = 1, perPage = 10 } = options;

  // Change the `fetching` state in our store.
  dispatch(
    fetchResultsAction({
      hideFetchingState,
      page,
    }),
  );

  try {
    // Attempt to make the API request to retreive results.
    const response = await fetchResults({
      page,
      perPage,
      mockRequest: true,
    });

    // Track the API request.
    // if (trackSearch) {
    //   recordEvent({
    //     event: 'third-party-apps-search',
    //     'third-party-apps-category': category || undefined,
    //     'third-party-apps-platform': platform || undefined,
    //     'third-party-apps-number-of-search-results': response?.totalResults,
    //   });
    // }

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

export const fetchScopesThunk = category => async dispatch => {
  dispatch(fetchScopesAction());

  try {
    const response = await fetchScopes(category);

    dispatch(fetchScopesSuccess(response, category));
  } catch (error) {
    dispatch(
      fetchScopesFailure(
        'We’re sorry. Something went wrong on our end. Please try again later.',
      ),
    );
  }
};
