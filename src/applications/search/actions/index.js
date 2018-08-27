import {
  ACCESS_KEY,
  AFFILIATE,
  BASE_URI
} from '../constants';

// const SEARCH_API_URL = `${BASE_URI}?affiliate=${AFFILIATE}&access_key=${ACCESS_KEY}&query=${this.state.term}`;

export const FETCH_SEARCH_RESULTS = 'FETCH_SEARCH_RESULTS';

// Action creator for grabbing search results and creating the "action" that will be passed to the reducer
export function fetchSearchResults(userInput) {
  const action = {
    type: FETCH_SEARCH_RESULTS,
    results: [
      {
        resultUrl: `https://vets.gov/health-care?query=${encodeURIComponent(userInput)}`,
      }
    ]
  };

  return action;
}
