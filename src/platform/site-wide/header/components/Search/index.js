import React from 'react';
import recordEvent from '~/platform/monitoring/record-event';
import { PAGE_PATH, SEARCH_LOCATION, SEARCH_APP_USED, addSearchGADataToStorage } from 'platform/site-wide/search-analytics-storage';
import SearchDropdownComponent from './SearchDropdownComponent';
import { replaceWithStagingDomain } from '../../../../utilities/environment/stagingDomains';

const Search = () => {
  const onInputSubmit = componentState => {
    const inputValue = componentState?.inputValue;

    addSearchGADataToStorage({
      pagePath: document.location.pathname,
      searchLocation: 'Header Search',
      sitewideSearch: false,
    });

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

    addSearchGADataToStorage({
      [PAGE_PATH]: document.location.pathname,
      [SEARCH_LOCATION]: 'Header Search',
      [SEARCH_APP_USED]: false,
    });

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
        htmlFor="search-header-dropdown-input-field"
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
        onInputSubmit={onInputSubmit}
        onSuggestionSubmit={onSuggestionSubmit}
      />
    </>
  );
};

export default Search;
