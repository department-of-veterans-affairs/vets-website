import {
  ACCESS_KEY,
  AFFILIATE,
  BASE_URI,
  UTF8
} from '../constants';

export const FETCH_SEARCH_RESULTS = 'FETCH_SEARCH_RESULTS';
export const SEARCH_RESULTS_ERROR = 'SEARCH_RESULTS_ERROR';

// Action creator for grabbing search results and creating the "action" that will be passed to the reducer
export function fetchSearchResults(userInput) {
  return async (dispatch) => { // Redux Thunk

    const searchApiUrl = `${BASE_URI}?affiliate=${AFFILIATE}&access_key=${ACCESS_KEY}&utf8=${encodeURIComponent(UTF8)}&query=${encodeURIComponent(userInput)}`;

    try {
      const response = await fetch(searchApiUrl);
      if (!response.ok) throw new Error(response.status);

      const json = await response.json();

      const action = {
        type: FETCH_SEARCH_RESULTS,
        results: json
      };

      dispatch(action);
    } catch (err) {
      dispatch({
        type: SEARCH_RESULTS_ERROR
      });
    }
  };
}
