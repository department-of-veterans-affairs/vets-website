export const UPDATE_SEARCH_ANALYTICS = 'searchAnalytics/UPDATE_SEARCH_ANALYTICS';
export const CLEAR_SEARCH_ANALYTICS = 'searchAnalytics/CLEAR_SEARCH_ANALYTICS';

export const updateSearchAnalytics = data => {
  console.log('data: ', data);
  return {
    type: UPDATE_SEARCH_ANALYTICS,
    pagePath: data.pagePath,
    searchLocation: data.searchLocation,
    sitewideSearchAppUsed: data.sitewideSearchAppUsed,
    typeaheadKeywordSelected: data.typeaheadKeywordSelected || null,
    typeaheadList: data.typeaheadList || null
  };
};

export const clearSearchAnalytics = () => {
  return {
    type: CLEAR_SEARCH_ANALYTICS
  };
};