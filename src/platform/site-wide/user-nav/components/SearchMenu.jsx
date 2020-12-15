import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import classNames from 'classnames';
import recordEvent from 'platform/monitoring/record-event';
import debounce from 'platform/utilities/data/debounce';
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
      searchAction: replaceWithStagingDomain('https://www.va.gov/search/'),
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

  handleInputChange = e => {
    this.setState({ userInput: e.target.value });
  };

  logSearchEvent = suggestion => () => {
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

  makeForm = () => {
    const validUserInput =
      this.state.userInput &&
      this.state.userInput.replace(/\s/g, '').length > 0;

    if (!this.props.searchTypeaheadEnabled) {
      return (
        <form
          acceptCharset="UTF-8"
          action={this.state.searchAction}
          id="search"
          method="get"
        >
          <label htmlFor="query" className="usa-sr-only">
            Search:
          </label>
          <div className="va-flex">
            <input
              autoComplete="off"
              ref="searchField"
              className="usagov-search-autocomplete vads-u-margin-right--0p5"
              id="query"
              name="query"
              type="text"
              onChange={this.handleInputChange}
            />
            <button
              type="submit"
              disabled={!validUserInput}
              className="vads-u-margin-left--0p25"
            >
              <IconSearch color="#fff" />
              <span className="usa-sr-only">Search</span>
            </button>
          </div>
        </form>
      );
    }

    return (
      <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-width--full">
        <form
          acceptCharset="UTF-8"
          action={this.state.searchAction}
          id="search"
          method="get"
          onSubmit={this.logSearchEvent(undefined)}
        >
          <label htmlFor="query" className="usa-sr-only">
            Search:
          </label>

          <div className="va-flex">
            <input
              autoComplete="off"
              ref="searchField"
              className="usagov-search-autocomplete vads-u-margin-right--0p5"
              id="query"
              name="query"
              type="text"
              onChange={this.handleInputChange}
              value={this.state.userInput}
            />

            <button
              type="submit"
              disabled={!validUserInput}
              className="vads-u-margin-left--0p25"
            >
              <IconSearch color="#fff" />
              <span className="usa-sr-only">Search</span>
            </button>
          </div>
        </form>
        {this.state.suggestions.length > 0 && (
          <ul className="typeahead-options vads-u-background-color--white vads-u-width--full vads-u-margin-y--1">
            {this.state.suggestions.map(suggestion => (
              <li key={suggestion}>
                <a
                  className="vads-u-padding--1 vads-u-line-height--2
                  vads-u-color--base vads-u-text-decoration--none vads-u-width--full"
                  onClick={this.logSearchEvent(suggestion)}
                  href={replaceWithStagingDomain(
                    `https://www.va.gov/search/?query=${encodeURIComponent(
                      suggestion,
                    )}`,
                  )}
                >
                  {this.formatTypeaheadSuggestion(suggestion)}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
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
