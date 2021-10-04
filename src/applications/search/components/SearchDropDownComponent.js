import React from 'react';
import PropTypes from 'prop-types';

import IconSearch from '@department-of-veterans-affairs/component-library/IconSearch';
import debounce from 'platform/utilities/data/debounce';
import * as Sentry from '@sentry/browser';
import { apiRequest } from 'platform/utilities/api';
import e from 'express';

const ID = 'SearchDropDownComponent';
const Keycodes = {
  Backspace: 8,
  Clear: 12,
  Down: 40,
  End: 35,
  Enter: 13,
  Escape: 27,
  Home: 36,
  Left: 37,
  PageDown: 34,
  PageUp: 33,
  Right: 39,
  Space: 32,
  Tab: 9,
  Up: 38,
};

const highlightedSuggestion =
  'suggestion-highlighted vads-u-background-color--primary-alt-light vads-u-color--gray-dark vads-u-margin-x--0 vads-u-margin-top--0p5 vads-u-margin-bottom--0  vads-u-padding-x--1p5 vads-u-padding-y--0p5 vads-u-width--full';

const regularSuggestion =
  'suggestion vads-u-color--gray-dark vads-u-margin-x--0 vads-u-margin-top--0p5 vads-u-margin-bottom--0 vads-u-padding-x--1p5 vads-u-padding-y--0p5 vads-u-width--full ';

class SearchDropDownComponent extends React.Component {
  constructor(props) {
    super(props);
    this.debouncedGetSuggestions = debounce(
      this.props.debounceRate,
      this.getSuggestions,
    );
    this.state = {
      activeIndex: undefined,
      isOpen: false,
      suggestions: [],
      savedSuggestions: [],
      inputValue: this.props.startingValue,
      selectedValue: '',
      ignoreBlur: false,
    };
  }

  componentDidMount() {
    if (this.props.startingValue) {
      this.getSuggestions();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { inputValue } = this.state;

    const inputChanged = prevState.inputValue !== inputValue;
    if (inputChanged) {
      this.debouncedGetSuggestions();
    }
  }

  handleInputChange = event => {
    this.setState({
      inputValue: event.target.value,
    });
  };

  onInputBlur() {
    const { ignoreBlur, isOpen, activeIndex } = this.state;

    if (ignoreBlur) {
      this.setState({ ignoreBlur: false });
      return;
    }

    if (isOpen) {
      if (activeIndex) {
        this.selectOption(activeIndex);
      }
      this.updateMenuState(false, false);
    }
  }

  onKeyDown = event => {
    const { suggestions, isOpen, activeIndex } = this.state;
    const max = suggestions.length - 1;

    if (!isOpen && (event.which || event.keycode) === Keycodes.Down) {
      this.updateMenuState(true, false);
      return;
    }

    if (!isOpen && (event.which || event.keycode) === Keycodes.Enter) {
      event.preventDefault();
      this.props.onInputSubmit(event, this.state);
      return;
    }

    // handle keys when open
    // next
    if ((event.which || event.keycode) === Keycodes.Down) {
      event.preventDefault();
      if (activeIndex === undefined || activeIndex + 1 > max) {
        this.setState({ activeIndex: 0 });
        return;
      }
      this.setState({ activeIndex: activeIndex + 1 });
      return;
    }

    // previous
    if (
      (event.which || event.keycode) === Keycodes.Up ||
      (event.which || event.keycode) === Keycodes.Left
    ) {
      event.preventDefault();
      if (activeIndex - 1 < 0) {
        this.setState({ activeIndex: max });
        return;
      }
      this.setState({ activeIndex: activeIndex - 1 });
      return;
    }

    // first
    if ((event.which || event.keycode) === Keycodes.Home) {
      event.preventDefault();
      this.setState({ activeIndex: 0 });
      return;
    }

    // last
    if ((event.which || event.keycode) === Keycodes.End) {
      event.preventDefault();
      this.setState({ activeIndex: max });
      return;
    }

    // close
    if ((event.which || event.keycode) === Keycodes.Escape) {
      event.preventDefault();
      this.setState({ activeIndex: undefined });
      this.updateMenuState(false);
      return;
    }

    // close and select
    if ((event.which || event.keycode) === Keycodes.Enter) {
      event.preventDefault();

      if (activeIndex === undefined) {
        event.preventDefault();
        this.props.onInputSubmit(event, this.state);
        return;
      }
      if (!this.props.submitOnEnter) {
        this.setState({ savedSuggestions: this.suggestions });
        this.selectOption(activeIndex);
        this.updateMenuState(false);
        return;
      }
      this.setState({ savedSuggestions: this.suggestions });
      this.selectOption(activeIndex);
      this.updateMenuState(false);
      this.submitOption(activeIndex);
    }
  };

  onOptionClick(index) {
    if (!this.props.submitOnClick) {
      this.setState({ activeIndex: index, savedSuggestions: this.suggestions });
      this.selectOption(index);
      this.updateMenuState(false);
      return;
    }
    this.submitOption(index);
    this.selectOption(index);
    this.updateMenuState(false);
  }

  onOptionMouseDown() {
    this.setState({ ignoreBlur: true });
  }

  selectOption(index) {
    const { suggestions } = this.state;
    const selected = suggestions[index];

    this.setState({
      selectedValue: selected,
      inputValue: selected,
      activeIndex: undefined,
    });
  }

  updateMenuState(open, callFocus = true) {
    this.setState({ isOpen: open });

    if (callFocus) {
      document.getElementById('search-dropdown-input-field').focus();
    }
  }

  clearSuggestions = () => {
    this.setState({ suggestions: [], savedSuggestions: [] });
  };

  saveSuggestions = () => {
    const { suggestions } = this.state;
    this.setState({ savedSuggestions: suggestions });
  };

  getSuggestions = async () => {
    const { inputValue } = this.state;

    // end early / clear suggestions if user input is too short
    if (inputValue?.length <= 2) {
      this.clearSuggestions();
      return;
    }

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
        const sortedSuggestions = fetchedSuggestions.sort(function(a, b) {
          return a.length - b.length;
        });
        this.setState({ suggestions: sortedSuggestions });
        return;
      }
      this.setState({ suggestions: [], savedSuggestions: [] });
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

  submitOption = index => {
    const { inputValue, suggestions, savedSuggestions } = this.state;

    const validSuggestions =
      savedSuggestions.length > 0 ? savedSuggestions : suggestions;

    this.props.fetchResults(validSuggestions[index], 1, {
      trackEvent: true,
      eventName: 'view_search_results',
      path: document.location.pathname,
      inputValue,
      typeaheadEnabled: true,
      keywordSelected: validSuggestions[index],
      keywordPosition: index + 1,
      suggestionsList: validSuggestions,
      sitewideSearch: false,
      searchLocation: this.props.searchLocation,
    });

    this.props.updateQueryInfo({
      query: suggestions[index],
      page: 1,
      typeaheadUsed: true,
    });

    this.props.updateURL({
      query: suggestions[index],
      page: 1,
      typeaheadUsed: true,
    });
  };

  render() {
    const { activeIndex, isOpen, inputValue, suggestions } = this.state;

    const activeId = isOpen ? `${ID}-${activeIndex}` : '';

    return (
      <div className="vads-u-flex-direction--column vads-u-width--full">
        <div className="vads-u-display--flex vads-u-width--full vads-u-flex-direction--row">
          <input
            aria-activedescendant={activeId}
            aria-autocomplete={'none'}
            aria-controls={`${ID}-listbox`}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-labelledby={ID}
            className="vads-u-width--full"
            role="combobox"
            type="text"
            id="search-dropdown-input-field"
            value={inputValue}
            onBlur={() => this.onInputBlur()}
            onClick={() => this.updateMenuState(true)}
            onFocus={() => this.updateMenuState(true)}
            onChange={this.handleInputChange}
            onKeyDown={this.onKeyDown}
          />
          <button
            type="submit"
            className="search-submit-button"
            onClick={() => this.props.onInputSubmit(e, this.state)}
            onFocus={this.saveSuggestions}
          >
            <IconSearch color="#fff" />
            <span className="button-text">Search</span>
          </button>
        </div>
        <div className="vads-u-flex-direction--column vads-u-width--full">
          {isOpen && (
            <div
              className="vads-u-padding--x-1"
              role="listbox"
              id={`${ID}-listbox`}
            >
              {suggestions.map((option, i) => {
                return (
                  <div
                    className={
                      i === activeIndex
                        ? highlightedSuggestion
                        : regularSuggestion
                    }
                    key={`${ID}-${i}`}
                    id={`${ID}-${i}`}
                    aria-selected={activeIndex === i ? 'true' : false}
                    role="option"
                    tabIndex="-1"
                    onClick={() => {
                      this.onOptionClick(i);
                    }}
                    onMouseDown={this.onOptionMouseDown.bind(this)}
                  >
                    {option}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default SearchDropDownComponent;

SearchDropDownComponent.propTypes = {
  clickHandler: PropTypes.func,
};

SearchDropDownComponent.defaultProps = {
  startingValue: '',
  submitOnEnter: false,
  submitOnClick: false,
  canSubmit: true,
  debounceRate: 200,
};
