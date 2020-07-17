// Dependencies.
import URLSearchParams from 'url-search-params';
// Relative imports.
import { fetchFormsApi } from '../api';
import {
  FETCH_FORMS,
  FETCH_FORMS_FAILURE,
  FETCH_FORMS_SUCCESS,
  UPDATE_PAGINATION,
} from '../constants';

// ============
// Fetch Forms (via API)
// ============
export const fetchFormsAction = query => ({
  query,
  type: FETCH_FORMS,
});

export const fetchFormsFailure = error => ({
  error,
  type: FETCH_FORMS_FAILURE,
});

export const fetchFormsSuccess = results => ({
  results,
  type: FETCH_FORMS_SUCCESS,
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
// Redux Thunks
// ============
export const fetchFormsThunk = (query, options = {}) => async dispatch => {
  // Derive options properties.
  const location = options?.location || window.location;
  const history = options?.history || window.history;
  const mockRequest = options?.mockRequest || false;

  // Change the `fetching` state in our store.
  dispatch(fetchFormsAction(query));

  // Reset the pagination.
  dispatch(updatePaginationAction());

  // Derive the current query params.
  const queryParams = new URLSearchParams(location.search);

  // Update the query params with the new `query`.
  queryParams.set('q', query);

  // Update the URL with the new query param.
  history.replaceState({}, '', `${location.pathname}?${queryParams}`);

  try {
    // Attempt to make the API request to retreive forms.
    const results = await fetchFormsApi(query, { mockRequest });

    // If we are here, the API request succeeded.
    dispatch(fetchFormsSuccess(results));
  } catch (error) {
    // If we are here, the API request failed.
    dispatch(
      fetchFormsFailure(
        'We’re sorry. Something went wrong on our end. Please try again later.',
      ),
    );
  }
};
