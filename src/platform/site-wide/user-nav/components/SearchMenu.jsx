import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import classNames from 'classnames';
import recordEvent from 'platform/monitoring/record-event';
import debounce from 'platform/utilities/data/debounce';
import Downshift from 'downshift';
import { escape } from 'lodash';
import * as Sentry from '@sentry/browser';

import { replaceWithStagingDomain } from '../../../utilities/environment/stagingDomains';
import IconSearch from '@department-of-veterans-affairs/formation-react/IconSearch';
import DropDownPanel from '@department-of-veterans-affairs/formation-react/DropDownPanel';

export const searchGovSuggestionEndpoint = 'https://search.usa.gov/sayt';

const ENTER_KEY = 13;

export class SearchMenu extends React.Component {
  constructor(props) {
    super(props);
    this.getSuggestions = debounce(
      this.props.debounceRate,
      this.getSuggestions,
    );
    this.state = {
      userInput: '',
      suggestions: [],
      highlightedIndex: null,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { userInput } = this.state;
    const { searchTypeaheadEnabled } = this.props;

    // if userInput has changed, fetch suggestions for the typeahead experience
    const inputChanged = prevState.userInput !== userInput;
    if (inputChanged && searchTypeaheadEnabled) {
      this.getSuggestions();
    }

    // event logging for phased typeahead rollout
    if (
      !prevProps.searchTypeaheadEnabled &&
      this.props.searchTypeaheadEnabled
    ) {
      recordEvent({
        event: 'phased-roll-out-enabled',
        'product-description': 'Type Ahead',
      });
    }
  }

  isUserInputValid = () => {
    const { userInput } = this.state;

    // check to make sure user input isn't empty
    const isCorrectLength =
      userInput && userInput.replace(/\s/g, '').length > 0;
    if (!isCorrectLength) {
      return false;
    }
    // this will likely expand in the future
    return true;
  };

  getSuggestions = async () => {
    const { userInput } = this.state;

    // end early / clear suggestions if user input is too short
    if (userInput?.length <= 2) {
      if (this.state.suggestions.length > 0) {
        this.setState({ suggestions: [] });
      }

      return;
    }

    // encode user input for query to suggestions url
    const encodedInput = encodeURIComponent(userInput);

    // fetch suggestions
    try {
      const response = await fetch(
        `${searchGovSuggestionEndpoint}?=&name=va&q=${encodedInput}`,
      );

      const suggestions = await response.json();
      this.setState({ suggestions });

      // if we fail to fetch suggestions
    } catch (error) {
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

  // handle event logging and fire off a search query
  handleSearchEvent = suggestion => {
    const { suggestions, userInput } = this.state;
    const { isUserInputValid } = this;

    // if the user tries to search with an empty input, escape early
    if (!isUserInputValid) {
      return;
    }

    // event logging, note suggestion will be undefined during a userInput search
    recordEvent({
      event: 'view_search_results',
      'search-page-path': document.location.pathname,
      'search-query': userInput,
      'search-results-total-count': undefined,
      'search-results-total-pages': undefined,
      'search-selection': 'All VA.gov',
      'search-typeahead-enabled': this.props.searchTypeaheadEnabled,
      'type-ahead-option-keyword-selected': suggestion,
      'type-ahead-option-position': suggestion
        ? suggestions.indexOf(suggestion) + 1
        : undefined,
      'type-ahead-options-list': suggestions,
    });

    // unifier to let the same function be used if we are searching from a userInput or a suggestion
    const query = suggestion || userInput;

    // create a search url
    const searchUrl = replaceWithStagingDomain(
      `https://www.va.gov/search/?query=${encodeURIComponent(query)}`,
    );

    // relocate to search results, preserving history
    window.location.assign(searchUrl);
  };

  makeForm = () => {
    const { suggestions, userInput } = this.state;
    const { searchTypeaheadEnabled } = this.props;
    const {
      getSuggestions,
      handelDownshiftStateChange,
      handleInputChange,
      handleSearchEvent,
      handleKeyUp,
      isUserInputValid,
    } = this;

    const highlightedSuggestion =
      'suggestion-highlighted vads-u-background-color--primary-alt-light vads-u-margin-x--0 vads-u-margin-top--0p5 vads-u-margin-bottom--0  vads-u-padding--1 vads-u-width--full';

    const regularSuggestion =
      'suggestion vads-u-margin-x--0 vads-u-margin-top--0p5 vads-u-margin-bottom--0 vads-u-padding--1 vads-u-width--full';

    // default search experience
    if (!searchTypeaheadEnabled) {
      return (
        <form
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
              disabled={!isUserInputValid}
              className="vads-u-margin-left--0p25 vads-u-margin-right--0p5 "
            >
              <IconSearch color="#fff" />
              <span className="usa-sr-only">Search</span>
            </button>
          </div>
        </form>
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
                className="usagov-search-autocomplete  vads-u-flex--4 vads-u-margin-left--1 vads-u-margin-right--0p5 vads-u-margin-y--1  vads-u-width--full"
                name="query"
                aria-controls={isOpen ? 'suggestions-list' : undefined}
                onFocus={getSuggestions}
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
                disabled={!isUserInputValid}
                className="vads-u-margin-left--0p5 vads-u-margin-y--1 vads-u-margin-right--1 vads-u-flex--1"
                onClick={() => handleSearchEvent()}
                onFocus={() => this.setState({ suggestions: [] })}
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
                  const formattedSuggestion = suggestion.replace(
                    userInput,
                    `<strong>${escape(userInput)}</strong>`,
                  );
                  return (
                    <li
                      key={suggestion}
                      role="option"
                      aria-selected={JSON.stringify(
                        selectedItem === suggestion,
                      )}
                      className={
                        highlightedIndex === index
                          ? highlightedSuggestion
                          : regularSuggestion
                      }
                      {...getItemProps({
                        item: suggestion,
                      })}
                      // this line is used to show the suggestion with the user's input in BOLD
                      // eslint-disable-next-line react/no-danger
                      dangerouslySetInnerHTML={{
                        __html: formattedSuggestion,
                      }}
                    />
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
      cssClass,
      'va-btn-withicon',
      'va-dropdown-trigger',
    );

    const icon = <IconSearch color="#fff" role="presentation" />;

    return (
      <DropDownPanel
        onClick={() => recordEvent({ event: 'nav-jumplink-click' })}
        buttonText="Search"
        clickHandler={clickHandler}
        dropdownPanelClassNames="vads-u-padding--0 vads-u-margin--0"
        cssClass={buttonClasses}
        id="search"
        icon={icon}
        isOpen={isOpen}
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
});

export default connect(mapStateToProps)(SearchMenu);
