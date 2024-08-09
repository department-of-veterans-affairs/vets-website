import * as Sentry from '@sentry/browser';
import { apiRequest } from '~/platform/utilities/api';

export const isSearchTermValid = term => {
  if (!term) {
    return false;
  }

  return term.trim().length <= 255;
};

export const fetchTypeaheadSuggestions = async inputValue => {
  // encode user input for query to suggestions url
  const encodedInput = encodeURIComponent(inputValue);

  // fetch suggestions
  try {
    if (!isSearchTermValid(inputValue)) {
      return [];
    }

    const apiRequestOptions = {
      method: 'GET',
    };

    const fetchedSuggestions = await apiRequest(
      `/search_typeahead?query=${encodedInput}`,
      apiRequestOptions,
    );

    if (fetchedSuggestions.length !== 0) {
      return fetchedSuggestions.sort((a, b) => {
        return a.length - b.length;
      });
    }

    return [];
    // if we fail to fetch suggestions
  } catch (error) {
    if (error?.error?.code === 'OVER_RATE_LIMIT') {
      Sentry.captureException(
        new Error(`"OVER_RATE_LIMIT" - Search Typeahead`),
      );
    }
    Sentry.captureException(error);
  }
  return [];
};
