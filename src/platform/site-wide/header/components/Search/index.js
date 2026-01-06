import React from 'react';
import {
  PAGE_PATH,
  SEARCH_LOCATION,
  SEARCH_APP_USED,
  SEARCH_SELECTION,
  addSearchGADataToStorage,
} from 'platform/site-wide/search-analytics';
import { replaceWithStagingDomain } from '../../../../utilities/environment/stagingDomains';

const Search = () => {
  const onInputSubmit = componentState => {
    const inputValue = componentState?.inputValue;
    const savedSuggestions = componentState?.savedSuggestions || [];
    const suggestions = componentState?.suggestions || [];
    const validSuggestions =
      savedSuggestions?.length > 0 ? savedSuggestions : suggestions;

    addSearchGADataToStorage({
      [PAGE_PATH]: document.location.pathname,
      [SEARCH_LOCATION]: 'Mobile Header Search',
      [SEARCH_APP_USED]: false,
      [SEARCH_SELECTION]: 'All VA.gov',
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

    const validSuggestions =
      savedSuggestions?.length > 0 ? savedSuggestions : suggestions;

    addSearchGADataToStorage({
      [PAGE_PATH]: document.location.pathname,
      [SEARCH_LOCATION]: 'Mobile Header Search',
      [SEARCH_APP_USED]: false,
      [SEARCH_SELECTION]: 'All VA.gov',
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
    </>
  );
};

export default Search;
