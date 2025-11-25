export const FETCH_SEARCH_RESULTS = 'FETCH_SEARCH_RESULTS';
export const FETCH_SEARCH_RESULTS_SUCCESS = 'FETCH_SEARCH_RESULTS_SUCCESS';
export const FETCH_SEARCH_RESULTS_FAILURE = 'FETCH_SEARCH_RESULTS_FAILURE';
export const FETCH_SEARCH_RESULTS_EMPTY = 'FETCH_SEARCH_RESULTS_EMPTY';

import { apiRequest } from 'platform/utilities/api';
import recordEvent from 'platform/monitoring/record-event';
import * as Sentry from '@sentry/browser';
import redactPii from 'platform/utilities/data/redactPii';

export function fetchSearchResults(query, page, options, clearGAData) {
  return dispatch => {
    dispatch({ type: FETCH_SEARCH_RESULTS, query });

    let queryString = `/search?query=${encodeURIComponent(query)}`;

    if (page) {
      queryString = queryString.concat(`&page=${page}`);
    }

    if (!query) {
      return dispatch({
        type: FETCH_SEARCH_RESULTS_EMPTY,
      });
    }

    return apiRequest(queryString)
      .then(response => {
        if (options?.trackEvent) {
          recordEvent({
            event: options?.eventName,
            'search-page-path': options?.path,
            'search-query': redactPii(options?.userInput),
            'search-results-total-count':
              response?.meta?.pagination?.totalEntries,
            'search-results-total-pages':
              response?.meta?.pagination?.totalPages,
            'search-selection': options?.searchSelection,
            'search-location': options?.searchLocation,
            'search-typeahead-enabled': options?.searchTypeaheadEnabled,
            'sitewide-search-app-used': options?.sitewideSearch,
            'type-ahead-option-keyword-selected': options?.keywordSelected,
            'type-ahead-option-position': options?.keywordPosition,
            'type-ahead-options-list': options?.suggestionsList,
            'type-ahead-options-count': options?.suggestionsList?.length,
          });

          clearGAData();
        }
        dispatch({
          type: FETCH_SEARCH_RESULTS_SUCCESS,
          results: response.data.attributes.body,
          meta: response.meta,
        });
      })
      .catch(error => {
        dispatch({
          type: FETCH_SEARCH_RESULTS_FAILURE,
          errors: [error],
        });
        // add sentry logging to help catch when search is down
        Sentry.captureException(error);
      });
  };
}
