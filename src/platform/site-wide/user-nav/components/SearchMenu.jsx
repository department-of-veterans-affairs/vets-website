import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import classNames from 'classnames';
import recordEvent from 'platform/monitoring/record-event';
import debounce from 'platform/utilities/data/debounce';
import Downshift from 'downshift';
import * as Sentry from '@sentry/browser';

import { replaceWithStagingDomain } from '../../../utilities/environment/stagingDomains';
import IconSearch from '@department-of-veterans-affairs/component-library/IconSearch';
import DropDownPanel from '@department-of-veterans-affairs/component-library/DropDownPanel';
import { apiRequest } from 'platform/utilities/api';
import SearchDropdownComponent from 'applications/search/components/SearchDropdown/SearchDropdownComponent';

const ENTER_KEY = 13;
const SPACE_KEY = 32;

export class SearchMenu extends React.Component {
  constructor(props) {
    super(props);
    this.debouncedGetSuggestions = debounce(
      this.props.debounceRate,
      this.getSuggestions,
    );
    this.state = {
      userInput: '',
      suggestions: [],
      savedSuggestions: [],
      highlightedIndex: null,
    };
  }
  componentDidMount() {
    document.addEventListener('keyup', () => {
      if (
        ((event.which || event.keyCode) === SPACE_KEY ||
          (event.which || event.keyCode) === ENTER_KEY) &&
        document.activeElement?.id === 'sitewide-search-submit-button'
      ) {
        this.handleSearchEvent();
      }
    });
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', () => {
      if (
        ((event.which || event.keyCode) === SPACE_KEY ||
          (event.which || event.keyCode) === ENTER_KEY) &&
        document.activeElement?.id === 'sitewide-search-submit-button'
      ) {
        this.handleSearchEvent();
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { userInput } = this.state;
    const { searchTypeaheadEnabled, isOpen } = this.props;

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

    if (userInput.length <= 2 && prevState.userInput.length > 2) {
      this.clearSuggestions();
    }

    // if userInput has changed, fetch suggestions for the typeahead experience
    const inputChanged = prevState.userInput !== userInput;
    if (inputChanged && searchTypeaheadEnabled) {
      this.debouncedGetSuggestions();
    }
  }

  clearSuggestions = () => {
    this.setState({ suggestions: [], savedSuggestions: [] });
  };

  getSuggestions = async () => {
    const { userInput } = this.state;

    // end early / clear suggestions if user input is too short
    if (userInput?.length <= 2) {
      this.clearSuggestions();
      return;
    }

    // encode user input for query to suggestions url
    const encodedInput = encodeURIComponent(userInput);

    // fetch suggestions
    try {
      const apiRequestOptions = {
        method: 'GET',
      };
      const suggestions = await apiRequest(
        `/search_typeahead?query=${encodedInput}`,
        apiRequestOptions,
      );

      if (suggestions.length !== 0) {
        const sortedSuggestions = suggestions.sort(function(a, b) {
          return a.length - b.length;
        });
        this.setState({ suggestions: sortedSuggestions, savedSuggestions: [] });
        return;
      }
      this.setState({ suggestions, savedSuggestions: [] });
      // if we fail to fetch suggestions
    } catch (error) {
      if (error?.error?.code === 'OVER_RATE_LIMIT') {
        Sentry.captureException(
          new Error(`"OVER_RATE_LIMIT" - Search Typeahead`),
        );
        return;
      }
      Sentry.captureException(error);
    }
  };

  handleInputChange = event => {
    this.setState({ userInput: event.target.value });
  };

  // function to control state changes within the downshift component
  handelDownshiftStateChange = (changes, state) => {
    // this logic here prevents the enter key from triggering too many search events
    if (
      changes.type !== Downshift.stateChangeTypes.keyDownEnter &&
      changes.selectedItem
    ) {
      this.handleSearchEvent(changes.selectedItem);
      return;
    }

    // when a user presses the escape key, clear suggestions and close the dropdown
    if (changes.type === Downshift.stateChangeTypes.keyDownEscape) {
      this.setState({
        highlightedIndex: null,
        suggestions: [],
      });
      return;
    }
    // when a user presses the enter key, exit early to prevent out highlighted suggestion being cleared
    if (changes.type === Downshift.stateChangeTypes.keyDownEnter) {
      return;
    }

    // keep track of the index of the highlighted suggestion so we can use it to fire off a search / log events
    this.setState({ highlightedIndex: state.highlightedIndex });
  };

  // function to handle searches kicked off by key presses
  handleKeyUp = event => {
    const { highlightedIndex, suggestions } = this.state;

    // kick off a search when an enter key is pressed
    if ((event.which || event.keyCode) === ENTER_KEY) {
      // if our highlighted index is null, search using the userInput (pass in undefined)
      // otherwise pass in our chosen suggestion
      const query =
        highlightedIndex !== null ? suggestions[highlightedIndex] : undefined;
      this.handleSearchEvent(query);
    }
  };

  handleSearchTab = () => {
    const { suggestions } = this.state;
    this.setState({ suggestions: [], savedSuggestions: suggestions });
  };

  // handle event logging and fire off a search query
  handleSearchEvent = suggestion => {
    const { suggestions, userInput, savedSuggestions } = this.state;

    const suggestionsList = [...suggestions, ...savedSuggestions];

    // event logging, note suggestion will be undefined during a userInput search
    recordEvent({
      event: 'view_search_results',
      'search-page-path': document.location.pathname,
      'search-query': userInput,
      'search-results-total-count': undefined,
      'search-results-total-pages': undefined,
      'search-selection': 'All VA.gov',
      'search-typeahead-enabled': this.props.searchTypeaheadEnabled,
      'sitewide-search-app-used': true,
      'type-ahead-option-keyword-selected': suggestion,
      'type-ahead-option-position': suggestion
        ? suggestionsList.indexOf(suggestion) + 1
        : undefined,
      'type-ahead-options-list': suggestionsList,
      'type-ahead-options-count': suggestionsList.length,
    });

    const typeaheadUsed = !!suggestion;
    // unifier to let the same function be used if we are searching from a userInput or a suggestion
    const query = suggestion || userInput;

    // create a search url
    const searchUrl = replaceWithStagingDomain(
      `https://www.va.gov/search/?query=${encodeURIComponent(
        query,
      )}&t=${typeaheadUsed}`,
    );

    // relocate to search results, preserving history
    window.location.assign(searchUrl);
  };

  formatSuggestion = suggestion => {
    if (!suggestion || !this.state.userInput) {
      return suggestion;
    }
    const lowerSuggestion = suggestion?.toLowerCase();
    const lowerQuery = this.state.userInput?.toLowerCase();
    if (lowerSuggestion.includes(lowerQuery)) {
      return (
        <>
          {this.state.userInput}
          <strong>{lowerSuggestion.replace(lowerQuery, '')}</strong>
        </>
      );
    }
    return <strong>{lowerSuggestion}</strong>;
  };

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
        return fetchedSuggestions.sort(function(a, b) {
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
      'sitewide-search-app-used': true,
      'type-ahead-option-keyword-selected': undefined,
      'type-ahead-option-position': undefined,
      'type-ahead-options-list': validSuggestions,
      'type-ahead-options-count': validSuggestions.length,
      'search-location': 'Search-Header',
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
      'sitewide-search-app-used': true,
      'type-ahead-option-keyword-selected': validSuggestions[index],
      'type-ahead-option-position': index + 1,
      'type-ahead-options-list': validSuggestions,
      'type-ahead-options-count': validSuggestions.length,
      'search-location': 'Search-Header',
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
    const { suggestions, userInput } = this.state;
    const {
      searchTypeaheadEnabled,
      searchDropdownComponentEnabled,
    } = this.props;
    const {
      debouncedGetSuggestions,
      handelDownshiftStateChange,
      handleInputChange,
      handleSearchEvent,
      handleKeyUp,
      formatSuggestion,
      handleSearchTab,
    } = this;

    const highlightedSuggestion =
      'suggestion-highlighted vads-u-background-color--primary-alt-light vads-u-color--gray-dark vads-u-margin-x--0 vads-u-margin-top--0p5 vads-u-margin-bottom--0  vads-u-padding--1 vads-u-width--full vads-u-padding-left--2';

    const regularSuggestion =
      'suggestion vads-u-color--gray-dark vads-u-margin-x--0 vads-u-margin-top--0p5 vads-u-margin-bottom--0 vads-u-padding--1 vads-u-width--full vads-u-padding-left--2';

    // default search experience
    if (!searchTypeaheadEnabled && !searchDropdownComponentEnabled) {
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
              onChange={handleInputChange}
            />
            <button
              type="submit"
              data-e2e-id="sitewide-search-submit-button"
              className="vads-u-margin-left--0p25 vads-u-margin-right--0p5 "
            >
              <IconSearch color="#fff" />
              <span className="usa-sr-only">Search</span>
            </button>
          </div>
        </form>
      );
    }

    // typeahead 2.0 experience
    // searchDropdownComponentEnabled
    if (searchDropdownComponentEnabled) {
      return (
        <SearchDropdownComponent
          buttonText=""
          canSubmit
          className="search-header-dropdown"
          fullWidthSuggestions
          formatSuggestions
          startingValue={''}
          submitOnClick
          submitOnEnter
          fetchSuggestions={this.fetchDropDownSuggestions}
          onInputSubmit={this.onInputSubmit}
          onSuggestionSubmit={this.onSuggestionSubmit}
        />
      );
    }

    // typeahead search experience
    return (
      <Downshift
        inputValue={userInput}
        isOpen={suggestions.length > 0}
        itemToString={item => item}
        onStateChange={handelDownshiftStateChange}
      >
        {({
          getInputProps,
          getItemProps,
          isOpen,
          highlightedIndex,
          selectedItem,
        }) => (
          <div className="typeahead-search vads-u-padding--0 vads-u-padding-x--0p5 medium-screen:vads-u-padding--0">
            <div className="va-flex vads-u-align-items--center vads-u-justify-content--center vads-u-padding-x--0p5 medium-screen:vads-u-padding--0">
              <label
                id="site-search-label"
                htmlFor="query"
                className="usa-sr-only"
              >
                Search:
              </label>
              <input
                autoComplete="off"
                className="usagov-search-autocomplete  vads-u-flex--4 vads-u-margin-left--1 vads-u-margin-right--0p5 vads-u-margin-y--1 vads-u-padding-left--1 vads-u-width--full"
                name="query"
                aria-controls={isOpen ? 'suggestions-list' : undefined}
                onFocus={debouncedGetSuggestions}
                onKeyUp={handleKeyUp}
                {...getInputProps({
                  type: 'text',
                  onChange: handleInputChange,
                  'aria-labelledby': 'site-search-label',
                  id: 'query',
                })}
              />
              <button
                type="submit"
                id="sitewide-search-submit-button"
                data-e2e-id="sitewide-search-submit-button"
                className="vads-u-margin-left--0p5 vads-u-margin-y--1 vads-u-margin-right--1 vads-u-flex--1"
                onMouseDown={event => {
                  event.preventDefault();
                  handleSearchEvent();
                }}
                onFocus={handleSearchTab}
              >
                <IconSearch color="#fff" />
                <span className="usa-sr-only">Search</span>
              </button>
            </div>
            {isOpen && (
              <ul
                id="suggestions-list"
                className="vads-u-margin-top--0p5"
                role="listbox"
                aria-label="suggestions-list"
              >
                {suggestions?.map((suggestion, index) => {
                  const formattedSuggestion = formatSuggestion(suggestion);
                  return (
                    <li
                      key={suggestion}
                      role="option"
                      aria-selected={JSON.stringify(
                        selectedItem === suggestion,
                      )}
                      data-e2e-id={`typeahead-option-${index + 1}`}
                      className={
                        highlightedIndex === index
                          ? highlightedSuggestion
                          : regularSuggestion
                      }
                      {...getItemProps({
                        item: suggestion,
                      })}
                    >
                      {formattedSuggestion}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </Downshift>
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

    const icon = <IconSearch color="#fff" role="presentation" />;

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
  clickHandler: PropTypes.func,
  cssClass: PropTypes.string,
  debounceRate: PropTypes.number,
  isOpen: PropTypes.bool.isRequired,
  searchTypeaheadEnabled: PropTypes.bool,
};

SearchMenu.defaultProps = {
  debounceRate: 200,
};

const mapStateToProps = store => ({
  searchTypeaheadEnabled: toggleValues(store)[
    FEATURE_FLAG_NAMES.searchTypeaheadEnabled
  ],
  searchDropdownComponentEnabled: toggleValues(store)[
    FEATURE_FLAG_NAMES.searchDropdownComponentEnabled
  ],
});

export default connect(mapStateToProps)(SearchMenu);
