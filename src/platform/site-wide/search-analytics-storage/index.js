// We want to log a single Google Analytics event when a user lands on /search with a search term
// Since we have multiple entry points for a site-wide search, we need an app-agnostic
// way to capture the search origin for the GA event that fires
export const addSearchGADataToStorage = data => {
  localStorage.setItem('pagePath', data?.pagePath);
  localStorage.setItem('searchLocation', data?.searchLocation);
  localStorage.setItem('sitewideSearchAppUsed', data?.sitewideSearchAppUsed);
  localStorage.setItem(
    'typeaheadKeywordSelected',
    data?.typeaheadKeywordSelected,
  );
  localStorage.setItem('typeaheadList', data?.typeaheadList);
};

export const getSearchGADataFromStorage = () => {
  return {
    pagePath: localStorage.getItem('pagePath'),
    searchLocation: localStorage.getItem('searchLocation'),
    sitewideSearchAppUsed: localStorage.getItem('sitewideSearchAppUsed'),
    typeaheadKeywordSelected: localStorage.getItem('typeaheadKeywordSelected'),
    typeaheadList: localStorage.getItem('typeaheadList'),
  };
};

export const removeSearchGADataFromStorage = () => {
  localStorage.removeItem('pagePath');
  localStorage.removeItem('searchLocation');
  localStorage.removeItem('sitewideSearchAppUsed');
  localStorage.removeItem('typeaheadKeywordSelected');
  localStorage.removeItem('typeaheadList');
};
