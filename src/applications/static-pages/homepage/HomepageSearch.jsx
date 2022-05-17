import React, { useState } from 'react';
import { VaSearchInput } from '@department-of-veterans-affairs/web-components/react-bindings';
import PropTypes from 'prop-types';
import { replaceWithStagingDomain } from '../../../platform/utilities/environment/stagingDomains';
// import recordEvent from '../../../platform/monitoring/record-event';

const HomepageSearch = ({ value, suggestions }) => {
  // const [userInput, setUserInput] = useState(value);
  const [latestSuggestions, setLatestSuggestions] = useState(suggestions);

  /**
   * Mock suggestions
   * Provides suggestions for the following values: for, form, forms
   * All other values will return an empty array
   */
  const mockSuggestions = [
    'foreign study',
    'forever gi bill',
    'form',
    'form finder',
    'form search',
    'forms',
  ];

  const handleInput = e => {
    if (e.target.value.length < 3) return;
    setTimeout(
      () =>
        setLatestSuggestions(
          mockSuggestions.filter(suggestion =>
            suggestion.includes(e.target.value),
          ),
        ),
      500,
    );

    // setUserInput(e.target.value);
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
        value={value}
        onInput={handleInput}
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
