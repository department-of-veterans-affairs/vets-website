import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import recordEvent from '~/platform/monitoring/record-event';
import { toggleValues } from '~/platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from '~/platform/utilities/feature-toggles/featureFlagNames';
import SearchDropdownComponent from './SearchDropdownComponent';
import { replaceWithStagingDomain } from '../../../../utilities/environment/stagingDomains';

export const Search = ({ searchDropdownComponentEnabled }) => {
  const [term, setTerm] = useState('');

  const onFormSubmit = event => {
    event.preventDefault();

    const searchResultsPage = `https://www.va.gov/search/?query=${term}&t=false`;

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

    window.location.href = searchResultsPage;
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

    const searchUrl = replaceWithStagingDomain(
      `https://www.va.gov/search/?query=${encodeURIComponent(
        validSuggestions[index],
      )}&t=${true}`,
    );

    // relocate to search results, preserving history
    window.location.assign(searchUrl);
  };

  const renderSearchDropdownComponent = () => (
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
        onInputSubmit={onInputSubmit}
        onSuggestionSubmit={onSuggestionSubmit}
      />
    </>
  );

  // Used for injected header only
  const renderDefaultSearchMenu = () => (
    <form
      className="header-search vads-u-display--flex vads-u-flex-direction--column vads-u-margin--0 vads-u-padding-x--1p5 vads-u-padding-bottom--2"
      onSubmit={onFormSubmit}
      role="search"
    >
      <label
        className="vads-u-color--gray-dark vads-u-margin--0 vads-u-margin-top--2"
        htmlFor="header-search"
      >
        Search
      </label>

      <div
        id="search-header-dropdown-component"
        className="vads-u-display--flex vads-u-flex-direction--row vads-u-align-items--center"
      >
        <input
          id="header-search"
          name="query"
          onChange={event => setTerm(event.target.value)}
          type="text"
          value={term}
        />
        <button
          className="vads-u-margin--0 vads-u-padding--0"
          type="submit"
          style={{
            width: '45px',
            height: '42px',
            borderBottomLeftRadius: 0,
            borderTopLeftRadius: 0,
          }}
        >
          <span className="usa-sr-only">Search</span>
          {/* search button icon */}
          {/* Convert to va-icon when injected header/footer split is in prod: https://github.com/department-of-veterans-affairs/vets-website/pull/27590 */}
          <svg
            aria-hidden="true"
            focusable="false"
            width="21"
            viewBox="0 -1 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#fff"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
            />
          </svg>
        </button>
      </div>
    </form>
  );

  return searchDropdownComponentEnabled
    ? renderSearchDropdownComponent()
    : renderDefaultSearchMenu();
};

Search.propTypes = {
  searchDropdownComponentEnabled: PropTypes.bool,
};

const mapStateToProps = store => ({
  searchDropdownComponentEnabled: toggleValues(store)[
    FEATURE_FLAG_NAMES.searchDropdownComponentEnabled
  ],
});

export default connect(mapStateToProps)(Search);
