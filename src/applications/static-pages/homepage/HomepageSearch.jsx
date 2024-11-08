import React, { useState } from 'react';
import { VaSearchInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import {
  addSearchGADataToStorage,
  PAGE_PATH,
  SEARCH_LOCATION,
  SEARCH_APP_USED,
} from 'platform/site-wide/search-analytics-storage';
import { replaceWithStagingDomain } from 'platform/utilities/environment/stagingDomains';
import { fetchTypeaheadSuggestions } from 'platform/utilities/search-utilities';

/**
 * Homepage redesign
 * Search component that appears in the Common Tasks section (midpage)
 * which uses the new Search Input component from the VA Design System
 */
const HomepageSearch = () => {
  const [userInput, setUserInput] = useState('');
  const [latestSuggestions, setLatestSuggestions] = useState([]);

  // clear all suggestions and saved suggestions
  const clearSuggestions = () => {
    setLatestSuggestions([]);
  };

  const handleInputChange = async e => {
    // update input value to new value
    const inputValue = e.target.value;
    setUserInput(inputValue);

    // don't display suggestions if input is too short
    if (inputValue?.length < 3) {
      clearSuggestions();
      return;
    }
    const results = await fetchTypeaheadSuggestions(inputValue);
    setLatestSuggestions(results);
  };

  const handleSubmit = e => {
    // create a search url
    const searchUrl = replaceWithStagingDomain(
      `https://www.va.gov/search/?query=${encodeURIComponent(
        e.target.value,
      )}&t=${false}`,
    );

    addSearchGADataToStorage({
      [PAGE_PATH]: '/',
      [SEARCH_LOCATION]: 'Homepage Search',
      [SEARCH_APP_USED]: false,
    });

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
