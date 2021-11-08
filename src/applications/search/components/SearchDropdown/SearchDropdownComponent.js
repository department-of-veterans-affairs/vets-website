import React from 'react';
import PropTypes from 'prop-types';
import './SearchDropdownStyles.scss';

import IconSearch from '@department-of-veterans-affairs/component-library/IconSearch';

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
     * A string value that will be prepended to the classnames for the button
     * */
    buttonClassNames: PropTypes.string,
    /**
     * A boolean value for whether or not the component has "submit" functionality
     * */
    canSubmit: PropTypes.bool,
    /**
     * A string value that will be prepended on each ID
     * */
    ID: PropTypes.string,
    /**
     * A string value that will be prepended to the classnames for the base component
     * */
    componentClassNames: PropTypes.string,
    /**
     * A string value that will be prepended to the classnames for the container
     * */
    containerClassNames: PropTypes.string,
    /**
     * A string value that will be prepended to the classnames for the input field
     * */
    inputClassNames: PropTypes.string,
    /**
     * A string value that will be prepended to the classnames for the suggestionsList
     * */
    suggestionsListClassNames: PropTypes.string,
    /**
     * A string value that will be prepended to the classnames for the individual suggestions
     * */
    suggestionClassNames: PropTypes.string,
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
    ID: '',
    debounceRate: 200,
    fetchSuggestions: undefined,
    formatSuggestions: false,
    fullWidthSuggestions: false,
    mobileResponsive: false,
    getInputValue: undefined,
    onInputSubmit: undefined,
    onSuggestionSubmit: undefined,
    showButton: true,
    startingValue: '',
    submitOnClick: false,
    submitOnEnter: false,
    buttonClassNames: '',
    componentClassNames: '',
    containerClassNames: '',
    inputClassNames: '',
    suggestionsListClassNames: '',
    suggestionClassNames: '',
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
      hasBeenChanged: false,
      a11yStatusMessage: '',
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
    const { getInputValue } = this.props;

    const inputChanged = prevState.inputValue !== inputValue;

    if (getInputValue && inputChanged) {
      getInputValue(inputValue);
    }

    clearTimeout(this.updateA11yTimeout);
    this.updateA11yTimeout = setTimeout(() => {
      this.setA11yStatusMessage();
    }, 300);
  }

  // when the component unmounts, clear the timeout if we have one.
  componentWillUnmount() {
    clearTimeout(this.fetchSuggestionsTimeout);
    clearTimeout(this.updateA11yTimeout);
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
      activeIndex: undefined,
      hasBeenChanged: true,
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
      this.setState({ activeIndex: 0 });
      return;
    }

    // last
    // when the END key is pressed, select the last option in the drop down menu
    if (currentKeyPress === Keycodes.End) {
      this.setState({ activeIndex: max });
      return;
    }

    // close
    // when the ESCAPE key is pressed, close the drop down menu WITHOUT selecting any of the options
    if (currentKeyPress === Keycodes.Escape) {
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
      hasBeenChanged: true,
    });
    this.fetchSuggestions(inputValue);
  }

  // update whether the menu is open or closed, and refocus the menu if called for
  updateMenuState(open, callFocus = true) {
    this.setState({ isOpen: open });

    if (callFocus) {
      document.getElementById(`${this.props.ID}-input-field`).focus();
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

  // derive the ally status message for screen reade
  getA11yStatusMessage = () => {
    const { isOpen, suggestions, activeIndex } = this.state;

    const suggestionsCount = suggestions?.length;

    if (!isOpen && suggestionsCount) {
      return `Closed, ${suggestionsCount} suggestions${
        suggestionsCount === 1 ? ' is' : 's are'
      }
   available`;
    }

    if (!isOpen) {
      return '';
    }

    if (!suggestionsCount) {
      return 'No suggestions are available.';
    }

    if (!(activeIndex + 1)) {
      return `Expanded, ${suggestionsCount} suggestion${
        suggestionsCount === 1 ? ' is' : 's are'
      }
   available`;
    }

    return `${suggestions[activeIndex]}, selected ${activeIndex +
      1} of ${suggestionsCount}`;
  };

  // derive the ally status message for screen reade
  setA11yStatusMessage = () => {
    const { isOpen, suggestions, activeIndex } = this.state;

    const suggestionsCount = suggestions?.length;

    if (!isOpen && suggestionsCount) {
      this.setState({
        a11yStatusMessage: `Closed, ${suggestionsCount} suggestions${
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

    if (!suggestionsCount) {
      this.setState({
        a11yStatusMessage: 'No suggestions are available.',
      });
      return;
    }

    if (!(activeIndex + 1)) {
      this.setState({
        a11yStatusMessage: `Expanded, ${suggestionsCount} suggestions${
          suggestionsCount === 1 ? ' is' : 's are'
        }
   available`,
      });
      return;
    }

    this.setState({
      a11yStatusMessage: `${suggestions[activeIndex]}, selected ${activeIndex +
        1} of ${suggestionsCount}`,
    });
  };

  // render
  render() {
    const {
      activeIndex,
      isOpen,
      inputValue,
      suggestions,
      hasBeenChanged,
    } = this.state;

    const {
      componentClassNames,
      containerClassNames,
      buttonClassNames,
      inputClassNames,
      suggestionsListClassNames,
      suggestionClassNames,
      ID,
      fullWidthSuggestions,
      formatSuggestions,
      showButton,
      canSubmit,
      onInputSubmit,
      buttonText,
      mobileResponsive,
    } = this.props;

    let activeId = undefined;
    if (isOpen && activeIndex !== undefined) {
      activeId = `${ID}-option-${activeIndex}`;
    }

    const assistiveHintID = `${ID}-assistive-hint`;

    const mobileResponsiveClass = mobileResponsive ? 'shrink-to-column' : '';

    const ariaDescribedProp = hasBeenChanged
      ? null
      : {
          'aria-describedby': assistiveHintID,
        };

    const validOpen = isOpen && suggestions.length > 0;

    const a11yStatusMessage = this.getA11yStatusMessage();

    return (
      <div
        id={`${ID}-component`}
        className={`search-dropdown-component vads-u-display--flex vads-u-width--full ${mobileResponsiveClass} ${
          fullWidthSuggestions ? 'full-width-suggestions' : ''
        } ${componentClassNames}`}
      >
        <div
          className={`search-dropdown-container vads-u-width--full vads-u-flex-direction--column ${
            fullWidthSuggestions
              ? 'full-width-suggestions vads-u-padding-y--1 vads-u-padding-left--1 vads-u-padding-right--0'
              : ''
          } ${containerClassNames}`}
        >
          <input
            aria-activedescendant={activeId}
            aria-autocomplete={'none'}
            aria-controls={`${ID}-listbox`}
            {...ariaDescribedProp}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-label={'Search'}
            className={`vads-u-width--full search-dropdown-input-field ${
              fullWidthSuggestions
                ? 'vads-u-margin--0 vads-u-display--block'
                : ''
            } ${inputClassNames}`}
            id={`${ID}-input-field`}
            data-e2e-id={`${ID}-input-field`}
            role="combobox"
            type="text"
            value={inputValue}
            onBlur={() => this.onInputBlur()}
            onChange={this.handleInputChange}
            onClick={() => this.updateMenuState(true)}
            onFocus={() => this.updateMenuState(true)}
            onKeyDown={this.onKeyDown}
          />
          <span
            id={assistiveHintID}
            className="vads-u-visibility--screen-reader"
          >
            Use up and down arrows to review autocomplete results and enter to
            search. Touch device users, explore by touch or with swipe gestures.
          </span>

          <span
            id="a11y-status-message"
            role="status"
            className="vads-u-visibility--screen-reader"
            aria-live="polite"
            aria-relevant="all"
          >
            {a11yStatusMessage}
          </span>

          {validOpen &&
            !fullWidthSuggestions && (
              <div
                className={`search-dropdown-options vads-u-padding--x-1 vads-u-background-color--white vads-u-width--full ${suggestionsListClassNames}`}
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
                          ? `suggestion vads-u-background-color--primary vads-u-color--white vads-u-width--full vads-u-margin--0 vads-u-padding-y--1 vads-u-padding-x--1p5 ${suggestionClassNames}`
                          : `suggestion vads-u-color--gray-dark vads-u-width--full vads-u-margin--0 vads-u-padding-y--1 vads-u-padding-x--1p5 ${suggestionClassNames}`
                      }
                      id={`${ID}-option-${i}`}
                      key={`${ID}-${i}`}
                      aria-hidden
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
              className={`search-dropdown-submit-button  ${
                fullWidthSuggestions ? 'vads-u-margin--1' : ''
              } ${buttonClassNames}`}
              data-e2e-id={`${ID}-submit-button`}
              id={`${ID}-submit-button`}
              onClick={() => onInputSubmit(this.state)}
              onFocus={this.saveSuggestions}
            >
              <IconSearch color="#fff" />
              <span className="usa-sr-only">Search</span>
              {buttonText && <span className="button-text">{buttonText}</span>}
            </button>
          )}
        {validOpen &&
          fullWidthSuggestions && (
            <div
              className={`search-dropdown-options full-width-suggestions vads-u-width--full vads-u-padding--x-1 vads-u-background-color--white vads-u-width--full ${suggestionsListClassNames}`}
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
                        ? `suggestion vads-u-background-color--primary vads-u-color--white vads-u-width--full vads-u-margin--0 vads-u-padding-y--1 vads-u-padding-x--1p5 ${suggestionClassNames}`
                        : `suggestion vads-u-color--gray-dark vads-u-width--full vads-u-margin--0 vads-u-padding-y--1 vads-u-padding-x--1p5 ${suggestionClassNames}`
                    }
                    id={`${ID}-option-${i}`}
                    key={`${ID}-${i}`}
                    aria-hidden
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
