import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import classNames from 'classnames';
import recordEvent from 'platform/monitoring/record-event';
import * as Sentry from '@sentry/browser';

import { apiRequest } from 'platform/utilities/api';
import SearchDropdownComponent from 'applications/search/components/SearchDropdown/SearchDropdownComponent';
import DropDownPanel from './DropDownPanel/DropDownPanel';
import { replaceWithStagingDomain } from '../../../utilities/environment/stagingDomains';

const ENTER_KEY = 13;
const SPACE_KEY = 32;

export class SearchMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInput: '',
    };
  }

  componentDidMount() {
    const { searchDropdownComponentEnabled } = this.props;
    if (!searchDropdownComponentEnabled) {
      document.addEventListener('keyup', event => {
        if (
          ((event.which || event.keyCode) === SPACE_KEY ||
            (event.which || event.keyCode) === ENTER_KEY) &&
          document.activeElement?.id === 'sitewide-search-submit-button'
        ) {
          this.handleSearchEvent();
        }
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { isOpen } = this.props;

    // focus the query input when the search menu is opened
    const inputField = document.getElementById('query');
    if (isOpen && !prevProps.isOpen && inputField) {
      inputField.focus();
    }

    // focus the search dropdown input field when the search menu is opened
    const dropdownInputField = document.getElementById(
      'search-header-dropdown-input-field',
    );
    if (isOpen && !prevProps.isOpen && dropdownInputField) {
      dropdownInputField.focus();
    }
  }

  componentWillUnmount() {
    const { searchDropdownComponentEnabled } = this.props;
    if (!searchDropdownComponentEnabled) {
      document.removeEventListener('keyup', event => {
        if (
          ((event.which || event.keyCode) === SPACE_KEY ||
            (event.which || event.keyCode) === ENTER_KEY) &&
          document.activeElement?.id === 'sitewide-search-submit-button'
        ) {
          this.handleSearchEvent();
        }
      });
    }
  }

  handleInputChange = event => {
    this.setState({ userInput: event.target.value });
  };

  // handle event logging and fire off a search query
  handleSearchEvent = () => {
    const { userInput } = this.state;

    // event logging
    recordEvent({
      event: 'view_search_results',
      'search-page-path': document.location.pathname,
      'search-query': userInput,
      'search-results-total-count': undefined,
      'search-results-total-pages': undefined,
      'search-selection': 'All VA.gov',
      'search-typeahead-enabled': false,
      'search-location': 'Search Header',
      'sitewide-search-app-used': true,
      'type-ahead-option-keyword-selected': undefined,
      'type-ahead-option-position': undefined,
      'type-ahead-options-list': undefined,
      'type-ahead-options-count': undefined,
    });

    // create a search url
    const searchUrl = replaceWithStagingDomain(
      `https://www.va.gov/search/?query=${encodeURIComponent(
        userInput,
      )}&t=false`,
    );

    // relocate to search results, preserving history
    window.location.assign(searchUrl);
  };

  // TA2.0
  fetchDropDownSuggestions = async inputValue => {
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

  onInputSubmit = componentState => {
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

  onSuggestionSubmit = (index, componentState) => {
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

  makeForm = () => {
    const { searchDropdownComponentEnabled } = this.props;
    const { handleInputChange, handleSearchEvent } = this;

    // default search experience
    if (!searchDropdownComponentEnabled) {
      return (
        <form
          className="vads-u-margin-bottom--0"
          acceptCharset="UTF-8"
          onSubmit={event => {
            event.preventDefault();
            handleSearchEvent();
          }}
        >
          <label htmlFor="query" className="usa-sr-only">
            Search:
          </label>
          <div className="va-flex vads-u-padding--1">
            <input
              aria-label="search"
              autoComplete="off"
              ref="searchField"
              className="usagov-search-autocomplete vads-u-margin-left--0p5 vads-u-margin-right--0p25"
              id="query"
              name="query"
              type="text"
              data-e2e-id="query"
              onChange={handleInputChange}
            />
            <button
              type="submit"
              data-e2e-id="sitewide-search-submit-button"
              className="vads-u-margin-left--0p25 vads-u-margin-right--0p5 "
            >
              <i className="fas fa-solid fa-sm fa-search vads-u-margin-top--0p5 " />
              <span className="usa-sr-only">Search</span>
            </button>
          </div>
        </form>
      );
    }

    // typeahead 2.0 experience
    // searchDropdownComponentEnabled
    return (
      <SearchDropdownComponent
        buttonText=""
        canSubmit
        id="search-header-dropdown"
        componentClassName=""
        containerClassName=""
        buttonClassName="vads-u-margin-left--1"
        inputClassName=""
        suggestionsListClassName=""
        suggestionClassName=""
        fullWidthSuggestions
        formatSuggestions
        startingValue=""
        submitOnClick
        submitOnEnter
        fetchSuggestions={this.fetchDropDownSuggestions}
        onInputSubmit={this.onInputSubmit}
        onSuggestionSubmit={this.onSuggestionSubmit}
      />
    );
  };

  render() {
    const { makeForm } = this;
    const { cssClass, clickHandler, isOpen } = this.props;

    const buttonClasses = classNames(
      'sitewide-search-drop-down-panel-button',
      cssClass,
      'va-btn-withicon',
      'va-dropdown-trigger',
    );

    const icon = (
      <i className="fas fa-solid fa-xs fa-search vads-u-margin-right--0p5" />
    );
    return (
      <DropDownPanel
        buttonText="Search"
        clickHandler={clickHandler}
        cssClass={buttonClasses}
        dropdownPanelClassNames="vads-u-padding--0 vads-u-margin--0"
        icon={icon}
        id="search"
        isOpen={isOpen}
        onClick={() => recordEvent({ event: 'nav-jumplink-click' })}
      >
        {makeForm()}
      </DropDownPanel>
    );
  }
}

SearchMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  clickHandler: PropTypes.func,
  cssClass: PropTypes.string,
  debounceRate: PropTypes.number,
  searchDropdownComponentEnabled: PropTypes.bool,
};

SearchMenu.defaultProps = {
  debounceRate: 200,
};

const mapStateToProps = store => ({
  searchDropdownComponentEnabled: toggleValues(store)[
    FEATURE_FLAG_NAMES.searchDropdownComponentEnabled
  ],
});

export default connect(mapStateToProps)(SearchMenu);
