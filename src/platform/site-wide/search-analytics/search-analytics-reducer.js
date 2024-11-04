// We want to log a single Google Analytics event when a user lands on /search with a search term
// Since we have multiple entry points for a site-wide search, we need an app-agnostic
// way to capture the search origin for the GA event that fires
import { CLEAR_SEARCH_ANALYTICS, UPDATE_SEARCH_ANALYTICS } from './search-analytics-actions';

export const initialState = {
  pagePath: null,
  searchLocation: null,
  sitewideSearchAppUsed: false
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case CLEAR_SEARCH_ANALYTICS:
      return initialState;
    case UPDATE_SEARCH_ANALYTICS:
      return {
        pagePath: action.pagePath,
        searchLocation: action.searchLocation,
        sitewideSearchAppUsed: action.sitewideSearchAppUsed
      }
  }

  return state;
};
