// We want to log a single Google Analytics event when a user lands on /search with a search term
// Since we have multiple entry points for a site-wide search, we need an app-agnostic
// way to capture the search origin for the GA event that fires
export const PAGE_PATH = 'path';
export const SEARCH_APP_USED = 'sitewideSearch';
export const SEARCH_LOCATION = 'searchLocation';
export const SEARCH_SELECTION = 'searchSelection';

export const clearGAData = () => {
  localStorage.removeItem(PAGE_PATH);
  localStorage.removeItem(SEARCH_APP_USED);
  localStorage.removeItem(SEARCH_LOCATION);
  localStorage.removeItem(SEARCH_SELECTION);
};

export const addSearchGADataToStorage = data => {
  clearGAData();

  localStorage.setItem(PAGE_PATH, data?.[PAGE_PATH]);
  localStorage.setItem(SEARCH_APP_USED, data?.[SEARCH_APP_USED]);
  localStorage.setItem(SEARCH_SELECTION, data?.[SEARCH_SELECTION]);
  localStorage.setItem(SEARCH_LOCATION, data?.[SEARCH_LOCATION]);
};

export const getSearchGADataFromStorage = () => {
  const sitewideSearchUsed = localStorage.getItem(SEARCH_APP_USED) === 'true';

  return {
    path: localStorage.getItem(PAGE_PATH),
    searchLocation: localStorage.getItem(SEARCH_LOCATION),
    sitewideSearch: sitewideSearchUsed,
    searchSelection: localStorage.getItem(SEARCH_SELECTION),
  };
};
