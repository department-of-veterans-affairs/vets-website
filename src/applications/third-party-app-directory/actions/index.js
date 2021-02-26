// Node modules.
import each from 'lodash/each';
import reduce from 'lodash/reduce';
import uniq from 'lodash/uniq';
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

export const fetchScopesSuccess = (response, scopeCategory) => ({
  response,
  scopeCategory,
  type: FETCH_SCOPES_SUCCESS,
});

// ============
// Redux Thunks
// ============
export const fetchResultsThunk = () => async dispatch => {
  // Change the `fetching` state in our store.
  dispatch(
    fetchResultsAction({
      hideFetchingState: true,
    }),
  );

  try {
    // Attempt to make the API request to retreive results.
    const response = await fetchResults({});

    // If we are here, the API request succeeded.
    dispatch(fetchResultsSuccess(response));
    const uniqueScopes = uniq(
      reduce(
        response.data,
        (scopes, app) => {
          return [...scopes, ...app.serviceCategories];
        },
        [],
      ),
    );
    dispatch(fetchScopesAction());
    each(uniqueScopes, async scope => {
      const scopesResponse = await fetchScopes(scope);
      dispatch(fetchScopesSuccess(scopesResponse, scope));
    });
  } catch (error) {
    // If we are here, the API request failed.
    dispatch(
      fetchResultsFailure(
        'We’re sorry. Something went wrong on our end. Please try again later.',
      ),
    );
  }
};
