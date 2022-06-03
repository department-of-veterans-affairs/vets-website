import React, { useState } from 'react';
import { VaSearchInput } from '@department-of-veterans-affairs/web-components/react-bindings';
import PropTypes from 'prop-types';
import * as Sentry from '@sentry/browser';

import { replaceWithStagingDomain } from 'platform/utilities/environment/stagingDomains';
import { apiRequest } from 'platform/utilities/api';

/**
 * Homepage redesign
 * Search component that appears in the Common Tasks section (midpage)
 * which uses the new Search Input component from the VA Design System
 */
const HomepageSearch = () => {
  const [userInput, setUserInput] = useState('');
  const [latestSuggestions, setLatestSuggestions] = useState([]);

  // fetch Typeahead suggestions from API
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
      return [];
    }
  };

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

    const results = await fetchDropDownSuggestions(inputValue);
    setLatestSuggestions(results);
  };

  const handleSubmit = e => {
    // create a search url
    const searchUrl = replaceWithStagingDomain(
      `https://www.va.gov/search/?query=${encodeURIComponent(
        e.target.value,
      )}&t=${false}`,
    );

    // relocate to search results, preserving history
    window.location.assign(searchUrl);
  };

  return (
    <div>
      <label htmlFor="site-search" className="usa-sr-only">
        Search the site:
      </label>

      <VaSearchInput
        value={userInput}
        onInput={handleInputChange}
        onSubmit={handleSubmit}
        suggestions={latestSuggestions}
      />
    </div>
  );
};

HomepageSearch.propTypes = {
  suggestions: PropTypes.array,
  value: PropTypes.string,
};

export default HomepageSearch;
