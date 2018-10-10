export const FETCH_SEARCH_RESULTS = 'FETCH_SEARCH_RESULTS';
export const FETCH_SEARCH_RESULTS_SUCCESS = 'FETCH_SEARCH_RESULTS_SUCCESS';
export const FETCH_SEARCH_RESULTS_FAILURE = 'FETCH_SEARCH_RESULTS_FAILURE';

import { apiRequest } from '../../../platform/utilities/api';

export function fetchSearchResults(query) {
  return dispatch => {
    dispatch({ type: FETCH_SEARCH_RESULTS, query });

    const settings = {
      method: 'GET',
    };

    apiRequest(
      `/search?query=${query}`,
      settings,
      response =>
        dispatch({
          type: FETCH_SEARCH_RESULTS_SUCCESS,
          results: response.data.attributes.body,
        }),
      error =>
        dispatch({
          type: FETCH_SEARCH_RESULTS_FAILURE,
          error,
        }),
    );
  };
}
