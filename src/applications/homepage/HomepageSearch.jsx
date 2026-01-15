import React, { useEffect, useState } from 'react';
import { VaSearchInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import {
  PAGE_PATH,
  SEARCH_APP_USED,
  SEARCH_LOCATION,
  SEARCH_SELECTION,
  SEARCH_TYPEAHEAD_ENABLED,
  TYPEAHEAD_CLICKED,
  TYPEAHEAD_LIST,
  addSearchGADataToStorage,
} from 'platform/site-wide/search-analytics';
import { replaceWithStagingDomain } from 'platform/utilities/environment/stagingDomains';

/**
 * Homepage redesign
 * Search component that appears in the Common Tasks section (midpage)
 * which uses the new Search Input component from the VA Design System
 */
const HomepageSearch = () => {
  const [userInput, setUserInput] = useState('');
  const [latestSuggestions, setLatestSuggestions] = useState([]);
  const [typeaheadClicked, setTypeaheadClicked] = useState(false);

  // clear all suggestions and saved suggestions
  const clearSuggestions = () => {
    setLatestSuggestions([]);
  };

  const handleInputChange = async e => {
    // update input value to new value
    const inputValue = e.target.value;
    setUserInput(inputValue);

    // Typeahead disabled - clear suggestions
    clearSuggestions();
  };

  useEffect(() => {
    if (document) {
      setTimeout(() => {
        const searchListBoxItems = document
          .querySelector('va-search-input')
          .shadowRoot?.querySelectorAll('.va-search-suggestion');

        if (searchListBoxItems?.length) {
          searchListBoxItems?.forEach(item => {
            item?.addEventListener('click', () => {
              setTypeaheadClicked(true);
            });
          });
        }
      }, 500);
    }
  });

  const handleSubmit = e => {
    // create a search url
    const searchUrl = replaceWithStagingDomain(
      `https://www.va.gov/search/?query=${encodeURIComponent(
        e.target.value,
      )}&t=${false}`,
    );

    const analyticsData = {
      [PAGE_PATH]: document.location.pathname,
      [SEARCH_LOCATION]: 'Homepage Search',
      [SEARCH_APP_USED]: false,
      [SEARCH_SELECTION]: 'All VA.gov - In page search',
      [SEARCH_TYPEAHEAD_ENABLED]: false,
      [TYPEAHEAD_CLICKED]: typeaheadClicked,
      [TYPEAHEAD_LIST]: latestSuggestions,
    };

    addSearchGADataToStorage(analyticsData);

    // relocate to search results, preserving history
    window.location.assign(searchUrl);
  };

  return (
    <VaSearchInput
      disableAnalytics
      value={userInput}
      label="Search VA.gov"
      onInput={handleInputChange}
      onSubmit={handleSubmit}
      suggestions={latestSuggestions}
      uswds
    />
  );
};

HomepageSearch.propTypes = {
  suggestions: PropTypes.array,
  value: PropTypes.string,
};

export default HomepageSearch;
