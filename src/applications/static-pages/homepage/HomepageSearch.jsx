import React, { useEffect, useState } from 'react';
import { VaSearchInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import {
  PAGE_PATH,
  SEARCH_APP_USED,
  SEARCH_LOCATION,
  SEARCH_SELECTION,
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

  const handleInputChange = async e => {
    // update input value to new value
    const inputValue = e.target.value;
    setUserInput(inputValue);
  };

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
      uswds
    />
  );
};

HomepageSearch.propTypes = {
  value: PropTypes.string,
};

export default HomepageSearch;
