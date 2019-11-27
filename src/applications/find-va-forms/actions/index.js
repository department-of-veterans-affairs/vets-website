// Dependencies.
import URLSearchParams from 'url-search-params';
// Relative imports.
import { fetchFormsApi } from '../api';
import {
  FETCH_FORMS,
  FETCH_FORMS_FAILURE,
  FETCH_FORMS_SUCCESS,
} from '../constants';

export const fetchFormsAction = query => ({
  query,
  type: FETCH_FORMS,
});

export const fetchFormsFailure = () => ({
  type: FETCH_FORMS_FAILURE,
});

export const fetchFormsSuccess = (results = []) => ({
  results,
  type: FETCH_FORMS_SUCCESS,
});

// ============
// Redux Thunks
// ============
export const fetchFormsThunk = query => async dispatch => {
  // Change the `fetching` state in our store.
  dispatch(fetchFormsAction(query));

  // Derive the current query params.
  const queryParams = new URLSearchParams(window.location.search);

  // Update the query params with the new `query`.
  queryParams.set('q', query);

  // Update the URL with the new query param.
  window.history.replaceState(
    {},
    '',
    `${window.location.pathname}?${queryParams}`,
  );

  try {
    // Attempt to make the API request to retreive forms.
    const forms = await fetchFormsApi(URL, query);

    // If we are here, the API request succeeded.
    dispatch(fetchFormsSuccess(forms));
  } catch (error) {
    // If we are here, the API request failed.
    dispatch(fetchFormsFailure());
  }
};
