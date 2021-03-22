export const FETCH_SEARCH_RESULTS = 'FETCH_SEARCH_RESULTS';
export const FETCH_SEARCH_RESULTS_SUCCESS = 'FETCH_SEARCH_RESULTS_SUCCESS';
export const FETCH_SEARCH_RESULTS_FAILURE = 'FETCH_SEARCH_RESULTS_FAILURE';

import { apiRequest } from 'platform/utilities/api';
import recordEvent from 'platform/monitoring/record-event';

export function fetchSearchResults(query, page, analyticsMetaInfo) {
  return dispatch => {
    dispatch({ type: FETCH_SEARCH_RESULTS, query });

    let queryString = `/search?query=${encodeURIComponent(query)}`;

    if (page) {
      queryString = queryString.concat(`&page=${page}`);
    }

    return apiRequest(queryString)
      .then(response => {
        if (analyticsMetaInfo) {
          recordEvent({
            event: analyticsMetaInfo?.eventName,
            'search-page-path': analyticsMetaInfo?.path,
            'search-query': analyticsMetaInfo?.userInput,
            'search-results-total-count':
              response?.meta?.pagination?.totalEntries,
            'search-results-total-pages':
              response?.meta?.pagination?.totalPages,
            'search-selection': 'All VA.gov',
            'search-typeahead-enabled': analyticsMetaInfo?.typeaheadEnabled,
            'sitewide-search-app-used': analyticsMetaInfo?.sitewideSearch,
            'type-ahead-option-keyword-selected':
              analyticsMetaInfo?.keywordSelected,
            'type-ahead-option-position': analyticsMetaInfo?.keywordPosition,
            'type-ahead-options-list': analyticsMetaInfo?.suggestionsList,
            'type-ahead-options-count':
              analyticsMetaInfo?.suggestionsList.length,
          });
        }
        dispatch({
          type: FETCH_SEARCH_RESULTS_SUCCESS,
          results: response.data.attributes.body,
          meta: response.meta,
        });
      })
      .catch(error =>
        dispatch({
          type: FETCH_SEARCH_RESULTS_FAILURE,
          errors: error.errors,
        }),
      );
  };
}
