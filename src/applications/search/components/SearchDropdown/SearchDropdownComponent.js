import React from 'react';
import PropTypes from 'prop-types';

import IconSearch from '@department-of-veterans-affairs/component-library/IconSearch';

const ID = 'search-dropdown-component';
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
  // Tab: 9,
  Up: 38,
};

class SearchDropdownComponent extends React.Component {
  static propTypes = {
    /**
     * A boolean value for whether the submit button should be rendered or not.
     * */
    showButton: PropTypes.bool,
    /**
     * A string value that should be displayed on the submit button
     * */
    buttonText: PropTypes.string,
    /**
     * A boolean value for whether or not the component has "submit" functionality
     * */
    canSubmit: PropTypes.bool,
    /**
     * the debounce rate at which to fetch suggestions
     * */
    debounceRate: PropTypes.number,
    /**
     * A boolean value for whether or not suggestions are formatted to have the suggested values highlighted
     * */
    formatSuggestions: PropTypes.bool,
    /**
     * A function that is called every time the input value changes, which is passed the current Input Value
     * */
    onInputChange: PropTypes.func,
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
    /**
     * A function that is passed the input value as a param,
     * and is called (with a debounce) whenever the value of the input field changes
     * this function MUST return an array of strings (suggestions)
     * */
    fetchSuggestions: PropTypes.func.isRequired,
    /**
     * A boolean value for whether or not the search button shall move underneath the input field when viewed on a small screen
     * */
    mobileResponsive: PropTypes.bool,
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
     * A boolean value for whether suggestions should take up the width of the input field and the button, or just the input field.
     * */
    fullWidthSuggestions: PropTypes.bool,
  };

  static defaultProps = {
    buttonText: '',
    canSubmit: false,
    className: '',
    debounceRate: 200,
    fetchSuggestions: undefined,
    formatSuggestions: false,
    fullWidthSuggestions: false,
    mobileResponsive: false,
    onInputChange: undefined,
    onInputSubmit: undefined,
    onSuggestionSubmit: undefined,
    showButton: true,
    startingValue: '',
    submitOnClick: false,
    submitOnEnter: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      activeIndex: undefined,
      ignoreBlur: false,
      inputValue: this.props.startingValue,
      isOpen: false,
      savedSuggestions: [],
      suggestions: [],
      hasBeenFocused: false,
    };
  }

  // when the component loads, fetch suggestions for our starting input value
  componentDidMount() {
    const { startingValue } = this.props;

    if (startingValue) {
      const suggestions = this.fetchSuggestions(startingValue);
      this.setState({ suggestions });
    }
  }

  // whenever the Input Value changes, call the prop function to export its value to the parent component
  componentDidUpdate(prevProps, prevState) {
    const { inputValue } = this.state;
    const { onInputChange } = this.props;

    const inputChanged = prevState.inputValue !== inputValue;

    if (onInputChange && inputChanged) {
      onInputChange(inputValue);
    }
  }

  // when the component unmounts, clear the timeout if we have one.
  componentWillUnmount() {
    clearTimeout(this.fetchSuggestionsTimeout);
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
          {inputValue}
          <strong>{lowerSuggestion.replace(lowerQuery, '')}</strong>
        </>
      );
    }
    return <strong>{lowerSuggestion}</strong>;
  };

  handleInputChange = event => {
    // update the input value to the new value
    const inputValue = event.target.value;
    this.setState({
      inputValue,
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

  focusInputField = () => {
    const { hasBeenFocused } = this.state;
    if (!hasBeenFocused) {
      this.setState({ hasBeenFocused: true });
    }
  };

  // call the fetchSuggestions prop and save the returned value into state
  fetchSuggestions = async inputValue => {
    const { fetchSuggestions } = this.props;

    const suggestions = await fetchSuggestions(inputValue);
    this.setState({ suggestions });
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

    const currentKeyPress = event.which || event.keycode;

    // if the menu is not open and the DOWN arrow key is pressed, open the menu
    if (!isOpen && currentKeyPress === Keycodes.Down) {
      this.updateMenuState(true, false);
      return;
    }

    // if the menu is not open and the ENTER key is pressed, search for the term currently in the input field
    if (!isOpen && currentKeyPress === Keycodes.Enter && canSubmit) {
      event.preventDefault();
      onInputSubmit(this.state);
      return;
    }

    // handle keys when open
    // next
    // when the DOWN key is pressed, select the next option in the drop down.
    // if the last option is selected, cycle to the first option instead
    if (currentKeyPress === Keycodes.Down) {
      event.preventDefault();
      if (activeIndex === undefined || activeIndex + 1 > max) {
        this.setState({ activeIndex: 0 });
        return;
      }
      this.setState({ activeIndex: activeIndex + 1 });
      return;
    }

    // previous
    // when the UP key is pressed, select the previous option in the drop down.
    // if the first option is selected, cycle to the last option instead
    if (currentKeyPress === Keycodes.Up || currentKeyPress === Keycodes.Left) {
      event.preventDefault();
      if (activeIndex - 1 < 0) {
        this.setState({ activeIndex: max });
        return;
      }
      this.setState({ activeIndex: activeIndex - 1 });
      return;
    }

    // first
    // when the HOME key is pressed, select the first option in the drop down menu
    if (currentKeyPress === Keycodes.Home) {
      event.preventDefault();
      this.setState({ activeIndex: 0 });
      return;
    }

    // last
    // when the END key is pressed, select the last option in the drop down menu
    if (currentKeyPress === Keycodes.End) {
      event.preventDefault();
      this.setState({ activeIndex: max });
      return;
    }

    // close
    // when the ESCAPE key is pressed, close the drop down menu WITHOUT selecting any of the options
    if (currentKeyPress === Keycodes.Escape) {
      event.preventDefault();
      this.setState({ activeIndex: undefined });
      this.updateMenuState(false);
      return;
    }

    // close and select
    // when the enter key is pressed, fire off a search of the Input Value if no menu items are selected
    // if a menu item is selected, close the drown down menu and select the currently highlighted option
    // if submitOnEnter is true, fire off the onInputSubmit function as well
    if (currentKeyPress === Keycodes.Enter) {
      event.preventDefault();

      if (activeIndex === undefined && canSubmit) {
        event.preventDefault();
        onInputSubmit(this.state);
        return;
      }
      if (!submitOnEnter) {
        this.selectOption(activeIndex);
        this.updateMenuState(false);
        return;
      }
      if (canSubmit) {
        onSuggestionSubmit(activeIndex, this.state);
        this.selectOption(activeIndex);
        this.updateMenuState(false);
      }
    }
  };

  // when an option is clicked
  // if submitOnClick is true, then initiate the onSuggestionSubmit function
  // otherwise, select the option and close the drop down menu
  onOptionClick(index) {
    const { submitOnClick, onSuggestionSubmit, canSubmit } = this.props;

    if (!submitOnClick) {
      this.setState({ activeIndex: index });
      this.selectOption(index);
      this.updateMenuState(false);
      return;
    }
    if (canSubmit) {
      onSuggestionSubmit(index, this.state);
      this.selectOption(index);
      this.updateMenuState(false);
    }
  }

  // select an option from the dropdown menu, updating the inputValue state and then fetch new suggestions
  selectOption(index) {
    const { suggestions } = this.state;
    const inputValue = suggestions[index];

    this.setState({
      inputValue,
      activeIndex: undefined,
      savedSuggestions: suggestions,
    });

    this.fetchSuggestions(inputValue);
  }

  // update whether the menu is open or closed, and refocus the menu if called for
  updateMenuState(open, callFocus = true) {
    this.setState({ isOpen: open });

    if (callFocus) {
      document.getElementById(`${this.props.className}-input-field`).focus();
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

  // render
  render() {
    const {
      activeIndex,
      isOpen,
      inputValue,
      suggestions,
      hasBeenFocused,
    } = this.state;

    const {
      className,
      fullWidthSuggestions,
      formatSuggestions,
      showButton,
      canSubmit,
      onInputSubmit,
      buttonText,
      mobileResponsive,
    } = this.props;

    const activeId = isOpen ? `${ID}-option-${activeIndex}` : undefined;

    const mobileResponsiveClass = mobileResponsive ? 'shrink-to-column' : '';

    const oneTimeAccessibilityLabel = hasBeenFocused
      ? undefined
      : 'Use up and down arrows to review autocomplete results and enter to search. Touch device users, explore by touch or with swipe gestures.';

    const validOpen = isOpen && suggestions.length > 0;

    return (
      <div
        className={`search-dropdown-component vads-u-display--flex vads-u-width--full ${mobileResponsiveClass} ${className}-component`}
      >
        <div className="search-dropdown-container vads-u-width--full vads-u-flex-direction--column">
          <input
            aria-activedescendant={activeId}
            aria-autocomplete={'none'}
            aria-controls={`${ID}-listbox`}
            aria-describedby={oneTimeAccessibilityLabel}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-label={'Search'}
            className="vads-u-width--full search-dropdown-input-field"
            id={`${className}-input-field`}
            data-e2e-id={`${className}-input-field`}
            role="combobox"
            type="text"
            value={inputValue}
            onBlur={() => this.onInputBlur()}
            onChange={this.handleInputChange}
            onClick={() => this.updateMenuState(true)}
            onFocus={() => {
              this.focusInputField();
              this.updateMenuState(true);
            }}
            onKeyDown={this.onKeyDown}
          />
          {validOpen &&
            !fullWidthSuggestions && (
              <div
                className="search-dropdown-options vads-u-padding--x-1"
                role="listbox"
                id={`${ID}-listbox`}
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
                          ? 'suggestion highlighted'
                          : 'suggestion regular'
                      }
                      id={`${ID}-option-${i}`}
                      key={`${ID}-${i}`}
                      role="option"
                      tabIndex="-1"
                      onClick={() => {
                        this.onOptionClick(i);
                      }}
                      onMouseDown={() => {
                        this.setState({ ignoreBlur: true });
                      }}
                      onMouseOver={() => {
                        this.setState({ activeIndex: i });
                      }}
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
              className="search-dropdown-submit-button"
              data-e2e-id={`${className}-submit-button`}
              onClick={() => onInputSubmit(this.state)}
              onFocus={this.saveSuggestions}
            >
              <IconSearch color="#fff" />
              {buttonText && <span className="button-text">{buttonText}</span>}
            </button>
          )}
        {validOpen &&
          fullWidthSuggestions && (
            <div
              className="search-dropdown-options vads-u-padding--x-1"
              role="listbox"
              id={`${ID}-listbox`}
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
                        ? 'suggestion highlighted'
                        : 'suggestion regular'
                    }
                    id={`${ID}-option-${i}`}
                    key={`${ID}-${i}`}
                    role="option"
                    tabIndex="-1"
                    onClick={() => {
                      this.onOptionClick(i);
                    }}
                    onMouseDown={() => {
                      this.setState({ ignoreBlur: true });
                    }}
                    onMouseOver={() => {
                      this.setState({ activeIndex: i });
                    }}
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

export default SearchDropdownComponent;
