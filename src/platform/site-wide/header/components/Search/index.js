// Node modules.
import React from 'react';
import * as Sentry from '@sentry/browser';

// Relative imports.
import { apiRequest } from 'platform/utilities/api';
import recordEvent from 'platform/monitoring/record-event';
import SearchDropdownComponent from 'applications/search/components/SearchDropdown/SearchDropdownComponent';
import { replaceWithStagingDomain } from '../../../../utilities/environment/stagingDomains';

export const Search = () => {
  // TA2.0
  const fetchDropDownSuggestions = async inputValue => {
    // encode user input for query to suggestions url
    const encodedInput = encodeURIComponent(inputValue);

    // fetch suggestions
    try {
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

  const onInputSubmit = componentState => {
    const savedSuggestions = componentState?.savedSuggestions || [];
    const suggestions = componentState?.suggestions || [];
    const inputValue = componentState?.inputValue;
    const validSuggestions =
      savedSuggestions.length > 0 ? savedSuggestions : suggestions;

    // event logging, note suggestion will be undefined during a userInput search
    recordEvent({
      event: 'view_search_results',
      'search-page-path': document.location.pathname,
      'search-query': inputValue,
      'search-results-total-count': undefined,
      'search-results-total-pages': undefined,
      'search-selection': 'All VA.gov',
      'search-typeahead-enabled': true,
      'search-location': 'Search Header',
      'sitewide-search-app-used': true,
      'type-ahead-option-keyword-selected': undefined,
      'type-ahead-option-position': undefined,
      'type-ahead-options-list': validSuggestions,
      'type-ahead-options-count': validSuggestions.length,
    });

    // create a search url
    const searchUrl = replaceWithStagingDomain(
      `https://www.va.gov/search/?query=${encodeURIComponent(
        inputValue,
      )}&t=${false}`,
    );

    // relocate to search results, preserving history
    window.location.assign(searchUrl);
  };

  const onSuggestionSubmit = (index, componentState) => {
    const savedSuggestions = componentState?.savedSuggestions || [];
    const suggestions = componentState?.suggestions || [];
    const inputValue = componentState?.inputValue;

    const validSuggestions =
      savedSuggestions?.length > 0 ? savedSuggestions : suggestions;

    // event logging, note suggestion will be undefined during a userInput search
    recordEvent({
      event: 'view_search_results',
      'search-page-path': document.location.pathname,
      'search-query': inputValue,
      'search-results-total-count': undefined,
      'search-results-total-pages': undefined,
      'search-selection': 'All VA.gov',
      'search-typeahead-enabled': true,
      'search-location': 'Search Header',
      'sitewide-search-app-used': true,
      'type-ahead-option-keyword-selected': validSuggestions[index],
      'type-ahead-option-position': index + 1,
      'type-ahead-options-list': validSuggestions,
      'type-ahead-options-count': validSuggestions.length,
    });

    // create a search url
    const searchUrl = replaceWithStagingDomain(
      `https://www.va.gov/search/?query=${encodeURIComponent(
        validSuggestions[index],
      )}&t=${true}`,
    );

    // relocate to search results, preserving history
    window.location.assign(searchUrl);
  };

  return (
    <>
      <label
        className="vads-u-color--gray-dark vads-u-margin--0 vads-u-margin-top--2 vads-u-margin-left--1p5"
        htmlFor="header-search"
      >
        Search
      </label>
      <SearchDropdownComponent
        buttonText=""
        canSubmit
        id="search-header-dropdown"
        componentClassName="vads-u-padding-x--0p5"
        containerClassName="vads-u-padding-bottom--2 vads-u-margin--0 search-input-container"
        buttonClassName="search-button"
        inputClassName="search-input"
        suggestionsListClassName=""
        suggestionClassName=""
        fullWidthSuggestions
        formatSuggestions
        startingValue=""
        submitOnClick
        submitOnEnter
        fetchSuggestions={fetchDropDownSuggestions}
        onInputSubmit={onInputSubmit}
        onSuggestionSubmit={onSuggestionSubmit}
      />
    </>
  );
};

export default Search;
