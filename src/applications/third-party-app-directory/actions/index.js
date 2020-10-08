// Node modules.
// import recordEvent from 'platform/monitoring/record-event';
// Relative imports.
import { fetchResultsApi } from '../api';
import { updateQueryParams } from '../helpers';
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
export const fetchResultsThunk = options => async dispatch => {
  const {
    category = null,
    platform = null,
    hideFetchingState,
    history,
    location,
    page = 1,
    perPage = 10,
  } = options;

  const queryParamsLookup = { category, platform };

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
      category,
      platform,
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
