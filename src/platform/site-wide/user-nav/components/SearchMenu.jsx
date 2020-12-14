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
import IconSearch from '@department-of-veterans-affairs/formation-react/IconSearch';
import DropDownPanel from '@department-of-veterans-affairs/formation-react/DropDownPanel';

export const searchGovSuggestionEndpoint = 'https://search.usa.gov/sayt';

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
    };
  }
  componentDidUpdate(prevProps, prevState) {
    const { userInput } = this.state;

    const inputChanged = prevState.userInput !== userInput;
    if (inputChanged) {
      this.getSuggestions();
    }
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

  async getSuggestions() {
    const { userInput } = this.state;

    if (userInput?.length <= 2) {
      if (this.state.suggestions.length > 0) {
        this.setState({ suggestions: [] });
      }

      return;
    }

    const encodedInput = encodeURIComponent(userInput);
    try {
      const response = await fetch(
        `${searchGovSuggestionEndpoint}?=&name=va&q=${encodedInput}`,
      );

      const suggestions = await response.json();
      this.setState({ suggestions });
    } catch (error) {
      Sentry.captureException(error);
    }
  }

  handleInputChange = event => {
    this.setState({ userInput: event.target.value });
  };

  formatTypeaheadSuggestion = suggestion => {
    const { userInput } = this.state;
    const remainder = suggestion.replace(userInput, '');
    return (
      <>
        <strong>{userInput}</strong>
        {remainder}
      </>
    );
  };

  handleSearchEvent = suggestion => {
    recordEvent({
      event: 'view_search_results',
      'search-page-path': document.location.pathname,
      'search-query': this.state.userInput,
      'search-results-total-count': undefined,
      'search-results-total-pages': undefined,
      'search-selection': 'All VA.gov',
      'search-typeahead-enabled': this.props.searchTypeaheadEnabled,
      'type-ahead-option-keyword-selected': suggestion,
      'type-ahead-option-position': suggestion
        ? this.state.suggestions.indexOf(suggestion) + 1
        : undefined,
      'type-ahead-options-list': this.state.suggestions,
    });

    const query = suggestion || this.state.userInput;

    const searchUrl = replaceWithStagingDomain(
      `https://www.va.gov/search/?query=${encodeURIComponent(query)}`,
    );

    window.location.replace(searchUrl);
  };

  makeForm = () => {
    const validUserInput =
      this.state.userInput &&
      this.state.userInput.replace(/\s/g, '').length > 0;

    const highlightedSuggestion =
      'suggestion-highlighted vads-u-background-color--primary-alt-light vads-u-margin-x--0 vads-u-margin-top--0p5 vads-u-margin-bottom--0  vads-u-padding--1 vads-u-width--full';

    const regularSuggestion =
      'suggestion vads-u-margin-x--0 vads-u-margin-top--0p5 vads-u-margin-bottom--0 vads-u-padding--1 vads-u-width--full';

    if (!this.props.searchTypeaheadEnabled) {
      return (
        <form acceptCharset="UTF-8" id="search">
          <label htmlFor="query" className="usa-sr-only">
            Search:
          </label>
          <div className="va-flex">
            <input
              aria-label="search"
              autoComplete="off"
              ref="searchField"
              className=" vads-u-margin-right--0p5"
              id="query"
              name="query"
              type="text"
              onChange={this.handleInputChange}
            />
            <button
              type="submit"
              disabled={!validUserInput}
              className="vads-u-margin-left--0p25"
              onSubmit={() => this.handleSearchEvent()}
            >
              <IconSearch color="#fff" />
              <span className="usa-sr-only">Search</span>
            </button>
          </div>
        </form>
      );
    }

    return (
      <Downshift
        id="search"
        inputValue={this.state.userInput}
        onSelect={item => this.handleSearchEvent(item)}
        itemToString={item => {
          return item;
        }}
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
              <label htmlFor="query" className="usa-sr-only">
                Search:
              </label>
              <input
                autoComplete="off"
                ref="searchField"
                className="usagov-search-autocomplete  vads-u-flex--4 vads-u-margin-left--1 vads-u-margin-right--0p5 vads-u-margin-y--1  vads-u-width--full"
                id="query"
                name="query"
                aria-controls="suggestions-list"
                {...getInputProps({
                  type: 'text',
                  onChange: this.handleInputChange,
                  'aria-labelledby': 'site search',
                })}
              />
              <button
                type="submit"
                disabled={!validUserInput}
                className="vads-u-margin-left--0p5 vads-u-margin-y--1 vads-u-margin-right--1 vads-u-flex--1"
                onClick={() => this.handleSearchEvent()}
              >
                <IconSearch color="#fff" />
                <span className="usa-sr-only">Search</span>
              </button>
            </div>
            {isOpen && (
              <div
                id="suggestions-list"
                className="vads-u-margin-top--0p5"
                role="listbox"
              >
                {this.state.suggestions?.map((suggestion, index) => (
                  <div
                    key={suggestion}
                    role="option"
                    aria-selected={
                      selectedItem === suggestion ? 'true' : 'false'
                    }
                    className={
                      highlightedIndex === index
                        ? highlightedSuggestion
                        : regularSuggestion
                    }
                    {...getItemProps({ item: suggestion })}
                  >
                    {this.formatTypeaheadSuggestion(suggestion)}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Downshift>
    );
  };

  render() {
    const buttonClasses = classNames(
      this.props.cssClass,
      'va-btn-withicon',
      'va-dropdown-trigger',
    );

    const icon = <IconSearch color="#fff" role="presentation" />;

    return (
      <DropDownPanel
        onClick={() => recordEvent({ event: 'nav-jumplink-click' })}
        buttonText="Search"
        clickHandler={this.props.clickHandler}
        dropdownPanelClassNames="vads-u-padding--0 vads-u-margin--0"
        cssClass={buttonClasses}
        id="search-menu"
        icon={icon}
        isOpen={this.props.isOpen}
      >
        {this.makeForm()}
      </DropDownPanel>
    );
  }
}

SearchMenu.propTypes = {
  cssClass: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  clickHandler: PropTypes.func,
  searchTypeaheadEnabled: PropTypes.bool,
  debounceRate: PropTypes.number,
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
