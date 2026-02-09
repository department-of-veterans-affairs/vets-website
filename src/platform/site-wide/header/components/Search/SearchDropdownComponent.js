// March 2024: This file is duplicated from the search application (src/applications/search) because we
// converted the search app used on the page in /search/?query={query} to use web components
// The header cannot support web components yet due to its integration with TeamSites, so this is the original
// non-web-component version of the Search app
import React from 'react';
import PropTypes from 'prop-types';
import { isSearchTermValid } from '~/platform/utilities/search-utilities';

const Keycodes = {
  Backspace: 8,
  Down: 40,
  End: 35,
  Enter: 13,
  Escape: 27,
  Home: 36,
  Left: 37,
  PageDown: 34,
  PageUp: 33,
  Right: 39,
  // Space: 32,
  Tab: 9,
  Up: 38,
};

class SearchDropdownComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: undefined,
      ignoreBlur: false,
      inputValue: this.props.startingValue,
      isOpen: false,
      savedSuggestions: [],
      suggestions: [],
      a11yStatusMessage: '',
      a11yLongStringMessage: '',
      displayA11yDescriptionFlag: undefined,
      fetchingSuggestions: true,
    };
  }

  // when the component loads, fetch suggestions for our starting input value
  componentDidMount() {
    const { startingValue } = this.props;

    if (startingValue) {
      const suggestions = this.fetchSuggestions(startingValue);
      this.setState({ suggestions });
    }

    const displayA11yDescriptionFlag = window.sessionStorage.getItem(
      'searchA11yDescriptionFlag',
    );
    this.setState({ displayA11yDescriptionFlag: !displayA11yDescriptionFlag });
  }

  // whenever the Input Value changes, call the prop function to export its value to the parent component
  componentDidUpdate(prevProps, prevState) {
    const { inputValue } = this.state;
    const { getInputValue, fetchInputValue } = this.props;

    const inputChanged = prevState.inputValue !== inputValue;

    if (getInputValue && inputChanged) {
      getInputValue(inputValue);
    }

    if (fetchInputValue && inputChanged) {
      fetchInputValue(inputValue);
    }

    clearTimeout(this.updateA11yTimeout);
    this.updateA11yTimeout = setTimeout(() => {
      this.setA11yStatusMessage();
    }, 300);

    clearTimeout(this.updateCheckInputForErrors);
    this.updateCheckInputForErrors = setTimeout(() => {
      this.checkInputForErrors();
    }, 5000);
  }

  // when the component unmounts, clear the timeout if we have one.
  componentWillUnmount() {
    clearTimeout(this.fetchSuggestionsTimeout);
    clearTimeout(this.updateA11yTimeout);
  }

  handleInputChange = event => {
    // update the input value to the new value
    const inputValue = event.target.value;
    this.setState({
      inputValue,
      activeIndex: undefined,
    });

    // clear suggestions if the input is too short
    if (inputValue?.length <= 2) {
      this.clearSuggestions();
      return;
    }

    // reset the timeout so we only fetch for suggestions after the debounce timer has elapsed
    clearTimeout(this.fetchSuggestionsTimeout);
    this.fetchSuggestionsTimeout = setTimeout(() => {
      this.fetchSuggestions(inputValue);
    }, this.props.debounceRate);
  };

  // call the fetchSuggestions prop and save the returned value into state
  fetchSuggestions = async _inputValue => {
    // Typeahead disabled - return empty suggestions
    this.setState({ suggestions: [], fetchingSuggestions: false });
  };

  // handle blur logic
  onInputBlur() {
    const { ignoreBlur, isOpen } = this.state;

    if (ignoreBlur) {
      this.setState({ ignoreBlur: false });
      return;
    }

    if (isOpen) {
      this.updateMenuState(false, false);
    }
  }

  focusIndex(index) {
    this.setState({ activeIndex: index, ignoreBlur: true }, () => {
      if (index !== undefined) {
        document.getElementById(`${this.props.id}-option-${index}`).focus({
          preventScroll: true,
        });
      }
    });
  }

  // this is the handler for all of the keypress logic
  onKeyDown = event => {
    const { suggestions, isOpen, activeIndex } = this.state;
    const {
      canSubmit,
      onInputSubmit,
      submitOnEnter,
      onSuggestionSubmit,
    } = this.props;
    const max = suggestions.length - 1;

    const currentKeyPress = event.which || event.keyCode;

    // if the menu is not open and the DOWN arrow key is pressed, open the menu
    if (!isOpen && currentKeyPress === Keycodes.Down) {
      event.preventDefault();
      this.updateMenuState(true, false);
      return;
    }

    // if the menu is not open and the ENTER key is pressed, search for the term currently in the input field
    if (!isOpen && currentKeyPress === Keycodes.Enter && canSubmit) {
      event.preventDefault();
      this.setA11yDescriptionFlag(false);
      onInputSubmit(this.state);
      return;
    }

    // handle keys when open
    // next
    // when the DOWN key is pressed, select the next option in the drop down.
    // if the last option is selected, cycle to the first option instead
    if (currentKeyPress === Keycodes.Down) {
      event.preventDefault();
      if (suggestions.length > 0) {
        if (activeIndex === undefined || activeIndex + 1 > max) {
          this.focusIndex(0);

          return;
        }

        this.focusIndex(activeIndex + 1);
        return;
      }
    }

    // previous
    // when the UP key is pressed, select the previous option in the drop down.
    // if the first option is selected, cycle to the last option instead
    if (currentKeyPress === Keycodes.Up) {
      event.preventDefault();

      if (suggestions.length > 0) {
        if (activeIndex - 1 < 0) {
          this.focusIndex(max);

          return;
        }
        this.focusIndex(activeIndex - 1);
        return;
      }
    }

    // first
    // when the HOME key is pressed, select the first option in the drop down menu
    if (currentKeyPress === Keycodes.Home) {
      if (suggestions.length > 0) {
        this.focusIndex(0);
      }
      return;
    }

    // last
    // when the END key is pressed, select the last option in the drop down menu
    if (currentKeyPress === Keycodes.End) {
      if (suggestions.length > 0) {
        this.focusIndex(max);
      }
      return;
    }

    // close
    // when the ESCAPE key is pressed, close the drop down menu WITHOUT selecting any of the options
    if (currentKeyPress === Keycodes.Escape) {
      document.getElementById(`${this.props.id}-input-field`).focus();

      this.setState({ activeIndex: undefined, isOpen: false });
      return;
    }

    // close and select
    // when the enter key is pressed, fire off a search of the Input Value if no menu items are selected
    // if a menu item is selected, close the drown down menu and select the currently highlighted option
    // if submitOnEnter is true, fire off the onInputSubmit function as well
    if (currentKeyPress === Keycodes.Enter) {
      event.preventDefault();

      if (activeIndex === undefined && canSubmit) {
        this.setA11yDescriptionFlag(false);
        onInputSubmit(this.state);
        return;
      }
      if (!submitOnEnter) {
        this.updateMenuState(false, true);
        this.selectOption(activeIndex);

        return;
      }
      if (canSubmit) {
        this.setA11yDescriptionFlag(false);
        this.selectOption(activeIndex);
        this.setState({ isOpen: false }, () => {
          onSuggestionSubmit(activeIndex, this.state);
        });
      }
    }

    // when the tab key is pressed, close the suggestions list and select the search button
    if (currentKeyPress === Keycodes.Tab) {
      // if focused on the input field and press shift + tab, close the menu and allow default behavior
      if (activeIndex === undefined && event.shiftKey) {
        this.updateMenuState(false, false);
        return;
      }

      // each of the below events should override default tab behavior
      event.preventDefault();

      // if in the dropdown options and press shift+tab, close the suggestions and focus the input bar
      if (event.shiftKey && activeIndex !== undefined) {
        this.setState({ activeIndex: undefined }, () => {
          this.updateMenuState(false, true);
        });
        return;
      }
      // in in the dropdown options and press tab, select the current item and focus the search button
      if (!event.shiftKey && activeIndex !== undefined) {
        this.selectOption(activeIndex);
        document.getElementById(`${this.props.id}-submit-button`).focus();
        return;
      }

      // else if on the input bar and you press tab, focus the button
      this.setState({ savedSuggestions: suggestions, suggestions: [] });
      document.getElementById(`${this.props.id}-submit-button`).focus();
    }
  };

  // when an option is clicked
  // if submitOnClick is true, then initiate the onSuggestionSubmit function
  // otherwise, select the option and close the drop down menu
  onOptionClick(index) {
    const { submitOnClick, onSuggestionSubmit, canSubmit } = this.props;

    if (!submitOnClick) {
      this.setState({ activeIndex: index });
      this.updateMenuState(false, true);
      this.selectOption(index);
      return;
    }
    if (canSubmit) {
      this.setA11yDescriptionFlag(false);
      this.selectOption(index);
      this.setState({ isOpen: false }, () => {
        onSuggestionSubmit(index, this.state);
      });
    }
  }

  // format suggestions so that the suggested text is BOLD
  formatSuggestion = suggestion => {
    const { inputValue } = this.state;

    if (!suggestion || !inputValue) {
      return suggestion;
    }
    const lowerSuggestion = suggestion?.toLowerCase();
    const lowerQuery = inputValue?.toLowerCase();
    if (lowerSuggestion.includes(lowerQuery)) {
      return (
        <>
          <span aria-hidden>{inputValue}</span>
          <strong aria-hidden>{lowerSuggestion.replace(lowerQuery, '')}</strong>
        </>
      );
    }
    return <strong aria-hidden>{lowerSuggestion}</strong>;
  };

  // select an option from the dropdown menu, updating the inputValue state
  selectOption(index) {
    const { suggestions } = this.state;
    const inputValue = suggestions[index];

    this.setState({
      inputValue,
      activeIndex: undefined,
      savedSuggestions: suggestions,
    });
  }

  setA11yDescriptionFlag = value => {
    window.sessionStorage.setItem('searchA11yDescriptionFlag', value);
    this.setState({ displayA11yDescriptionFlag: value });
  };

  // update whether the menu is open or closed, and refocus the menu if called for
  updateMenuState(open, callFocus = true) {
    this.setState({ isOpen: open });

    if (callFocus) {
      document.getElementById(`${this.props.id}-input-field`).focus();
    }
  }

  // clear all suggestions and saved suggestions
  clearSuggestions = () => {
    this.setState({ suggestions: [], savedSuggestions: [] });
  };

  // save the current suggestions list into saved suggestions
  saveSuggestions = () => {
    const { suggestions } = this.state;
    this.setState({ savedSuggestions: suggestions });
  };

  // handle shift tabbing to reset suggestions list
  handleButtonShift = event => {
    const { savedSuggestions } = this.state;
    const { id } = this.props;
    const currentKeyPress = event.which || event.keycode;
    if (event.shiftKey && currentKeyPress === Keycodes.Tab) {
      event.preventDefault();
      this.setState(
        {
          suggestions: savedSuggestions,
          savedSuggestions: [],
        },
        () => {
          document.getElementById(`${id}-input-field`).focus();
        },
      );
    }
  };

  // derive the ally status message for screen reade
  setA11yStatusMessage = () => {
    const {
      isOpen,
      suggestions,
      activeIndex,
      inputValue,
      fetchingSuggestions,
    } = this.state;

    const suggestionsCount = suggestions?.length;
    if (inputValue.length > 255) {
      this.setState({
        a11yStatusMessage:
          'The search is over the character limit. Shorten the search and try again.',
      });
      return;
    }

    if (
      !isOpen &&
      (document.activeElement !==
        document.getElementById(`${this.props.id}-input-field`) ||
        document.activeElement !==
          document.getElementById(`${this.props.id}-submit-button`))
    ) {
      this.setState({
        a11yStatusMessage: '',
      });
      return;
    }

    if (!isOpen && suggestionsCount) {
      this.setState({
        a11yStatusMessage: `Closed, ${suggestionsCount} suggestion${
          suggestionsCount === 1 ? ' is' : 's are'
        }
   available`,
      });
      return;
    }

    if (!isOpen) {
      this.setState({
        a11yStatusMessage: '',
      });
      return;
    }

    if (!suggestionsCount && inputValue?.length > 3 && !fetchingSuggestions) {
      this.setState({
        a11yStatusMessage: 'No suggestions are available.',
      });
      return;
    }

    if (!(activeIndex + 1) && inputValue?.length > 2) {
      this.setState({
        a11yStatusMessage: `Expanded, ${suggestionsCount} suggestion${
          suggestionsCount === 1 ? ' is' : 's are'
        }
   available`,
      });
      return;
    }

    if (activeIndex !== undefined) {
      this.setState({
        a11yStatusMessage: `${
          suggestions[activeIndex]
        }, selected ${activeIndex + 1} of ${suggestionsCount}`,
      });
      return;
    }

    this.setState({
      a11yStatusMessage: '',
    });
  };

  checkInputForErrors = () => {
    if (!isSearchTermValid(this.state.inputValue)) {
      this.setState({
        a11yLongStringMessage:
          'The search is over the character limit. Shorten the search and try again.',
      });
      clearTimeout(this.resetA11yMessage);
      this.resetA11yMessage = setTimeout(() => {
        this.setState({
          a11yLongStringMessage: '',
        });
      }, 5000);
    }
  };

  resetInputForErrors = () => {
    this.setState({
      a11yLongStringMessage: '',
    });
  };

  // render
  render() {
    const {
      activeIndex,
      isOpen,
      inputValue,
      suggestions,
      a11yStatusMessage,
      displayA11yDescriptionFlag,
      a11yLongStringMessage,
    } = this.state;

    const {
      componentClassName,
      containerClassName,
      buttonClassName,
      inputClassName,
      suggestionsListClassName,
      suggestionClassName,
      id,
      fullWidthSuggestions,
      formatSuggestions,
      showButton,
      canSubmit,
      onInputSubmit,
      buttonText,
      mobileResponsive,
    } = this.props;

    let activeId;
    if (isOpen && activeIndex !== undefined) {
      activeId = `${id}-option-${activeIndex}`;
    }
    const inputHasLengthError = inputValue.length >= 255;

    const assistiveHintid = `${id}-assistive-hint`;

    const errorStringLengthId =
      'search-results-page-dropdown-a11y-status-message';

    const mobileResponsiveClass = mobileResponsive ? 'shrink-to-column' : '';

    const ariaDescribedProp = displayA11yDescriptionFlag
      ? {
          'aria-describedby': inputHasLengthError
            ? `${errorStringLengthId} ${assistiveHintid}`
            : assistiveHintid,
        }
      : null;

    const validOpen = isOpen && suggestions.length > 0;

    return (
      <div
        id={`${id}-component`}
        className={`search-dropdown-component vads-u-display--flex vads-u-width--full ${mobileResponsiveClass} ${
          fullWidthSuggestions ? 'full-width-suggestions' : ''
        } ${componentClassName}`}
      >
        <div
          className={`search-dropdown-container vads-u-width--full vads-u-flex-direction--column ${
            fullWidthSuggestions
              ? 'full-width-suggestions vads-u-padding-y--1 vads-u-padding-left--1 vads-u-padding-right--0'
              : ''
          } ${containerClassName}`}
        >
          <span
            id={`${id}-a11y-status-message`}
            role="status"
            className="vads-u-visibility--screen-reader"
            aria-live="assertive"
            aria-relevant="additions text"
          >
            {a11yStatusMessage}
          </span>

          {inputHasLengthError && (
            <span
              id={`${id}-a11y-status-message-submit-button-click`}
              role="status"
              className="vads-u-visibility--screen-reader"
              aria-live="assertive"
              aria-relevant="additions text"
            >
              {a11yLongStringMessage}
            </span>
          )}

          <span
            id={assistiveHintid}
            className="vads-u-visibility--screen-reader"
          >
            Use up and down arrows to review autocomplete results and enter to
            search. Touch device users, explore by touch or with swipe gestures.
          </span>
          <input
            aria-activedescendant={activeId}
            aria-autocomplete="none"
            aria-controls={`${id}-listbox`}
            {...ariaDescribedProp}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-label={!mobileResponsive ? 'Search' : ''}
            autoComplete="off"
            className={`vads-u-width--full search-dropdown-input-field ${
              fullWidthSuggestions
                ? 'vads-u-margin--0 vads-u-display--block'
                : ''
            } ${inputClassName}`}
            id={`${id}-input-field`}
            data-e2e-id={`${id}-input-field`}
            role="combobox"
            type="text"
            tabIndex="0"
            value={inputValue}
            onBlur={() => this.onInputBlur()}
            onChange={this.handleInputChange}
            onClick={() => this.updateMenuState(true)}
            onFocus={() => this.updateMenuState(true)}
            onKeyDown={this.onKeyDown}
          />
          {validOpen &&
            !fullWidthSuggestions && (
              <div
                className={`search-dropdown-options vads-u-padding--x-1 vads-u-background-color--white vads-u-width--full ${suggestionsListClassName}`}
                role="listbox"
                aria-label="Search Suggestions"
                id={`${id}-listbox`}
                data-e2e-id="search-dropdown-options"
              >
                {suggestions.map((suggestionString, i) => {
                  const suggestion = formatSuggestions
                    ? this.formatSuggestion(suggestionString)
                    : suggestionString;
                  return (
                    <div
                      aria-selected={activeIndex === i ? 'true' : false}
                      className={
                        i === activeIndex
                          ? `suggestion vads-u-background-color--primary vads-u-color--white vads-u-width--full vads-u-margin--0 vads-u-padding-y--1 vads-u-padding-x--1p5 ${suggestionClassName}`
                          : `suggestion vads-u-color--gray-dark vads-u-width--full vads-u-margin--0 vads-u-padding-y--1 vads-u-padding-x--1p5 ${suggestionClassName}`
                      }
                      id={`${id}-option-${i}`}
                      key={`${id}-${i}`}
                      aria-hidden
                      tabIndex="-1"
                      role="option"
                      onClick={() => {
                        this.onOptionClick(i);
                      }}
                      onMouseDown={() => {
                        this.setState({ ignoreBlur: true });
                      }}
                      onMouseOver={() => {
                        this.setState({ activeIndex: i });
                      }}
                      onKeyDown={this.onKeyDown}
                      onFocus={() => {
                        this.setState({ activeIndex: i });
                      }}
                    >
                      {suggestion}
                    </div>
                  );
                })}
              </div>
            )}
        </div>
        {/* only show the submit button if the component has submit capabilities */}
        {showButton &&
          canSubmit && (
            <button
              type="submit"
              className={`search-dropdown-submit-button vads-u-margin-right--1 ${
                fullWidthSuggestions ? 'vads-u-margin-top--1 ' : ''
              } ${buttonClassName}`}
              data-e2e-id={`${id}-submit-button`}
              id={`${id}-submit-button`}
              tabIndex="0"
              onClick={() => {
                this.updateMenuState(false, false);
                this.checkInputForErrors();
                onInputSubmit(this.state);
              }}
              onFocus={() => {
                this.updateMenuState(false, false);
              }}
              onKeyDown={this.handleButtonShift}
            >
              {/* search icon on the header dropdown (next to the input on desktop) */}
              {/* Convert to va-icon when injected header/footer split is in prod: https://github.com/department-of-veterans-affairs/vets-website/pull/27590 */}
              <svg
                aria-hidden="true"
                focusable="false"
                width="18"
                viewBox="2 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#fff"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
                />
              </svg>
              {buttonText ? (
                <span className="button-text">{buttonText}</span>
              ) : (
                <span className="usa-sr-only">Search</span>
              )}
            </button>
          )}
        {validOpen &&
          fullWidthSuggestions && (
            <div
              className={`search-dropdown-options full-width-suggestions vads-u-width--full vads-u-padding--x-1 vads-u-background-color--white vads-u-width--full ${suggestionsListClassName}`}
              role="listbox"
              id={`${id}-listbox`}
              data-e2e-id="search-dropdown-options"
            >
              {suggestions.map((suggestionString, i) => {
                const suggestion = formatSuggestions
                  ? this.formatSuggestion(suggestionString)
                  : suggestionString;
                return (
                  <div
                    aria-selected={activeIndex === i ? 'true' : false}
                    className={
                      i === activeIndex
                        ? `suggestion vads-u-background-color--primary vads-u-color--white vads-u-width--full vads-u-margin--0 vads-u-padding-y--1 vads-u-padding-x--1p5 ${suggestionClassName}`
                        : `suggestion vads-u-color--gray-dark vads-u-width--full vads-u-margin--0 vads-u-padding-y--1 vads-u-padding-x--1p5 ${suggestionClassName}`
                    }
                    id={`${id}-option-${i}`}
                    key={`${id}-${i}`}
                    aria-hidden
                    tabIndex="-1"
                    role="option"
                    onClick={() => {
                      this.onOptionClick(i);
                    }}
                    onMouseDown={() => {
                      this.setState({ ignoreBlur: true });
                    }}
                    onMouseOver={() => {
                      this.setState({ activeIndex: i });
                    }}
                    onKeyDown={this.onKeyDown}
                    onFocus={() => {
                      this.setState({ activeIndex: i });
                    }}
                  >
                    {suggestion}
                  </div>
                );
              })}
            </div>
          )}
      </div>
    );
  }
}

SearchDropdownComponent.propTypes = {
  /**
   * A string value that will be prepended to the classnames for the button
   * */
  buttonClassName: PropTypes.string,
  /**
   * A string value that should be displayed on the submit button
   * */
  buttonText: PropTypes.string,
  /**
   * A boolean value for whether or not the component has "submit" functionality
   * */
  canSubmit: PropTypes.bool,
  /**
   * A string value that will be prepended to the classnames for the base component
   * */
  componentClassName: PropTypes.string,
  /**
   * A string value that will be prepended to the classnames for the container
   * */
  containerClassName: PropTypes.string,
  /**
   * the debounce rate at which to fetch suggestions
   * */
  debounceRate: PropTypes.number,
  /**
   * A boolean value for whether or not suggestions are formatted to have the suggested values highlighted
   * */
  formatSuggestions: PropTypes.bool,
  /**
   * A boolean value for whether suggestions should take up the width of the input field and the button, or just the input field.
   * */
  fullWidthSuggestions: PropTypes.bool,
  /**
   * A string value that will be prepended on each id
   * */
  id: PropTypes.string,
  /**
   * A string value that will be prepended to the classnames for the input field
   * */
  inputClassName: PropTypes.string,
  /**
   * A boolean value for whether or not the search button shall move underneath the input field when viewed on a small screen
   * */
  mobileResponsive: PropTypes.bool,
  /**
   * A boolean value for whether the submit button should be rendered or not.
   * */
  showButton: PropTypes.bool,
  /**
   * A string value that will be prepended to the classnames for the individual suggestions
   * */
  suggestionClassName: PropTypes.string,
  /**
   * A string value that will be prepended to the classnames for the suggestionsList
   * */
  suggestionsListClassName: PropTypes.string,
  /**
   * A string value for the default value of the input field.
   * */
  startingValue: PropTypes.string,
  /**
   * A boolean value for whether clicking on a suggestion will "submit" it
   * */
  submitOnClick: PropTypes.bool,
  /**
   * A boolean value for whether pressing enter with a suggestion will "submit" it
   * */
  submitOnEnter: PropTypes.bool,
  /**
   * A function that is passed to retrieve the input for the search app component
   * */
  fetchInputValue: PropTypes.func,
  /**
   * A function that is called every time the input value changes, which is passed the current Input Value
   * */
  getInputValue: PropTypes.func,
  /**
   * A function that is passed the current state as a param,
   * and is called whenever the input field's current value is submitted
   * */
  onInputSubmit: PropTypes.func,
  /**
   * A function that is passed the current state as a param,
   * and is called whenever a suggested value is submitted
   * */
  onSuggestionSubmit: PropTypes.func,
};

SearchDropdownComponent.defaultProps = {
  buttonClassName: '',
  buttonText: '',
  canSubmit: false,
  componentClassName: '',
  containerClassName: '',
  debounceRate: 200,
  fetchInputValue: undefined,
  formatSuggestions: false,
  fullWidthSuggestions: false,
  getInputValue: undefined,
  id: '',
  inputClassName: '',
  mobileResponsive: false,
  onInputSubmit: undefined,
  onSuggestionSubmit: undefined,
  showButton: true,
  startingValue: '',
  suggestionClassName: '',
  suggestionsListClassName: '',
  submitOnClick: false,
  submitOnEnter: false,
};

export default SearchDropdownComponent;
