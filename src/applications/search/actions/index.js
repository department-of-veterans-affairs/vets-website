export const FETCH_SEARCH_RESULTS = 'FETCH_SEARCH_RESULTS';
export const FETCH_SEARCH_RESULTS_SUCCESS = 'FETCH_SEARCH_RESULTS_SUCCESS';
export const FETCH_SEARCH_RESULTS_FAILURE = 'FETCH_SEARCH_RESULTS_FAILURE';

import { apiRequest } from '../../../platform/utilities/api';

export function fetchSearchResults(query, page) {
  return dispatch => {
    dispatch({ type: FETCH_SEARCH_RESULTS, query });

    const settings = {
      method: 'GET',
    };

    let queryString = `/search?query=${query}`;

    if (page) {
      queryString = queryString.concat(`&page=${page}`);
    }

    apiRequest(
      queryString,
      settings,
      response =>
        dispatch({
          type: FETCH_SEARCH_RESULTS_SUCCESS,
          results: response.data.attributes.body,
          meta: response.meta,
        }),
      error =>
        dispatch({
          type: FETCH_SEARCH_RESULTS_FAILURE,
          error,
        }),
    );
  };
}
