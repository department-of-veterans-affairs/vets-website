// Node modules.
import React, { useState } from 'react';
// Relative imports.
import IconSearch from '@department-of-veterans-affairs/component-library/IconSearch';
import recordEvent from 'platform/monitoring/record-event';

export const Search = () => {
  const [term, setTerm] = useState('');

  const onFormSubmit = event => {
    event.preventDefault();

    // Derive the search results page.
    const searchResultsPage = `https://www.va.gov/search/?query=${term}&t=false`;

    // Record the analytic event.
    recordEvent({
      event: 'view_search_results',
      'search-page-path': searchResultsPage,
      'search-query': term,
      'search-results-total-count': null,
      'search-results-total-pages': null,
      'search-selection': 'All VA.gov',
      'search-typeahead-enabled': false,
      'search-location': 'Search Results Page',
      'sitewide-search-app-used': false,
      'type-ahead-option-keyword-selected': null,
      'type-ahead-option-position': null,
      'type-ahead-options-list': null,
      'type-ahead-options-count': null,
    });

    // Redirect to the search results page.
    window.location.href = searchResultsPage;
  };

  return (
    <form
      className="header-search vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--1p5"
      onSubmit={onFormSubmit}
    >
      <label
        className="vads-u-color--gray-dark vads-u-margin--0 vads-u-margin-top--2"
        htmlFor="header-search"
      >
        Search
      </label>

      <div className="vads-u-display--flex vads-u-flex-direction--row vads-u-align-items--center">
        <input
          aria-label="Enter a keyword"
          className="vads-u-width--full"
          id="header-search"
          name="query"
          onChange={event => setTerm(event.target.value)}
          type="text"
          value={term}
        />
        <button className="vads-u-margin--0 vads-u-padding--0" type="submit">
          <IconSearch color="#fff" />
        </button>
      </div>
    </form>
  );
};

export default Search;
