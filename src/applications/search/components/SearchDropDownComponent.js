import React from 'react';
import PropTypes from 'prop-types';

import IconSearch from '@department-of-veterans-affairs/component-library/IconSearch';
import './SearchDropDownStyles.scss';

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

class SearchDropDownComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: undefined,
      ignoreBlur: false,
      inputValue: this.props.startingValue,
      isOpen: false,
      savedSuggestions: [],
      suggestions: [],
    };
  }

  // when the component loads, fetch suggestions for our starting input value
  componentDidMount() {
    if (this.props.startingValue) {
      const suggestions = this.getSuggestions(this.props.startingValue);
      this.setState({ suggestions });
    }
  }

  // whenever the Input Value changes, call the prop function to export its value to the parent component
  componentDidUpdate(prevProps, prevState) {
    const { inputValue } = this.state;
    const inputChanged = prevState.inputValue !== inputValue;

    if (this.props.getInputValue && inputChanged) {
      this.props.getInputValue(inputValue);
    }
  }

  // when the component unmounts, clear the timeout if we have one.
  componentWillUnmount() {
    clearTimeout(this.getSuggestionsTimeout);
  }

  // format suggestions so that the suggested text is BOLD
  formatSuggestion = suggestion => {
    if (!suggestion || !this.state.inputValue) {
      return suggestion;
    }
    const lowerSuggestion = suggestion?.toLowerCase();
    const lowerQuery = this.state.inputValue?.toLowerCase();
    if (lowerSuggestion.includes(lowerQuery)) {
      return (
        <>
          {this.state.inputValue}
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
    clearTimeout(this.getSuggestionsTimeout);
    this.getSuggestionsTimeout = setTimeout(() => {
      this.getSuggestions(inputValue);
    }, this.props.debounceRate);
  };

  // call the getSuggestions prop and save the returned value into state
  getSuggestions = async inputValue => {
    const suggestions = await this.props.getSuggestions(inputValue);
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
    const max = suggestions.length - 1;

    // if the menu is not open and the DOWN arrow key is pressed, open the menu
    if (!isOpen && (event.which || event.keycode) === Keycodes.Down) {
      this.updateMenuState(true, false);
      return;
    }

    // if the menu is not open and the ENTER key is pressed, search for the term currently in the input field
    if (
      !isOpen &&
      (event.which || event.keycode) === Keycodes.Enter &&
      this.props.canSubmit
    ) {
      event.preventDefault();
      this.props.onInputSubmit(this.state);
      return;
    }

    // handle keys when open
    // next
    // when the DOWN key is pressed, select the next option in the drop down.
    // if the last option is selected, cycle to the first option instead
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
    // when the UP key is pressed, select the previous option in the drop down.
    // if the first option is selected, cycle to the last option instead
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
    // when the HOME key is pressed, select the first option in the drop down menu
    if ((event.which || event.keycode) === Keycodes.Home) {
      event.preventDefault();
      this.setState({ activeIndex: 0 });
      return;
    }

    // last
    // when the END key is pressed, select the last option in the drop down menu
    if ((event.which || event.keycode) === Keycodes.End) {
      event.preventDefault();
      this.setState({ activeIndex: max });
      return;
    }

    // close
    // when the ESCAPE key is pressed, close the drop down menu WITHOUT selecting any of the options
    if ((event.which || event.keycode) === Keycodes.Escape) {
      event.preventDefault();
      this.setState({ activeIndex: undefined });
      this.updateMenuState(false);
      return;
    }

    // close and select
    // when the enter key is pressed, fire off a search of the Input Value if no menu items are selected
    // if a menu item is selected, close the drown down menu and select the currently highlighted option
    // if submitOnEnter is true, fire off the onInputSubmit function as well
    if ((event.which || event.keycode) === Keycodes.Enter) {
      event.preventDefault();

      if (activeIndex === undefined && this.props.canSubmit) {
        event.preventDefault();
        this.props.onInputSubmit(this.state);
        return;
      }
      if (!this.props.submitOnEnter) {
        this.selectOption(activeIndex);
        this.updateMenuState(false);
        return;
      }
      if (this.props.canSubmit) {
        this.props.onSuggestionSubmit(activeIndex, this.state);
        this.selectOption(activeIndex);
        this.updateMenuState(false);
      }
    }
  };

  // when an option is clicked
  // if submitOnClick is true, then initiate the onSuggestionSubmit function
  // otherwise, select the option and close the drop down menu
  onOptionClick(index) {
    if (!this.props.submitOnClick) {
      this.setState({ activeIndex: index });
      this.selectOption(index);
      this.updateMenuState(false);
      return;
    }
    this.props.onSuggestionSubmit(index, this.state);
    this.selectOption(index);
    this.updateMenuState(false);
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

    this.getSuggestions(inputValue);
  }

  // update whether the menu is open or closed, and refocus the menu if called for
  updateMenuState(open, callFocus = true) {
    this.setState({ isOpen: open });

    if (callFocus) {
      document.getElementById('search-dropdown-input-field').focus();
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
    const { activeIndex, isOpen, inputValue, suggestions } = this.state;

    const activeId = isOpen ? `${ID}-${activeIndex}` : undefined;

    const mobileResponsiveClass = this.props.shrinkToColumn
      ? ' search-dropdown-component shrink-to-column'
      : 'search-dropdown-component';

    return (
      <div
        className={`vads-u-display--flex vads-u-width--full ${mobileResponsiveClass}`}
      >
        <div className="search-dropdown vads-u-width--full vads-u-flex-direction--column">
          <input
            aria-activedescendant={activeId}
            aria-autocomplete={'none'}
            aria-controls={`${ID}-listbox`}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-label={'Search'}
            className="vads-u-width--full"
            id="search-dropdown-input-field"
            role="combobox"
            type="text"
            value={inputValue}
            onBlur={() => this.onInputBlur()}
            onChange={this.handleInputChange}
            onClick={() => this.updateMenuState(true)}
            onFocus={() => this.updateMenuState(true)}
            onKeyDown={this.onKeyDown}
          />
          {isOpen &&
            suggestions.length > 0 && (
              <div
                className="search-dropdown-options vads-u-padding--x-1"
                role="listbox"
                id={`${ID}-listbox`}
              >
                {suggestions.map((suggestionString, i) => {
                  const suggestion = this.props.formatSuggestions
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
                      id={`${ID}-${i}`}
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
        {this.props.canSubmit && (
          <button
            type="submit"
            className="search-submit-button"
            onClick={() => this.props.onInputSubmit(this.state)}
            onFocus={this.saveSuggestions}
          >
            <IconSearch color="#fff" />
            {this.props.buttonText && (
              <span className="button-text">{this.props.buttonText}</span>
            )}
          </button>
        )}
      </div>
    );
  }
}

export default SearchDropDownComponent;

SearchDropDownComponent.propTypes = {
  clickHandler: PropTypes.func,
  buttonText: PropTypes.string,
  canSubmit: PropTypes.bool,
  debounceRate: PropTypes.number,
  formatSuggestions: PropTypes.bool,
  // getInputValue is passed the current Input Value as a param
  getInputValue: PropTypes.func,
  // onInputSubmit is passed the current state as a param, and is called when the input field's value is submitted
  onInputSubmit: PropTypes.func,
  // onSuggestionSubmit is passed the current state as a param, and is called when a suggestions's value is submitted
  onSuggestionSubmit: PropTypes.func,
  // getSuggestions is passed the current input field's value and MUST return a set of suggestions
  getSuggestions: PropTypes.func,
  shrinkToColumn: PropTypes.bool,
  startingValue: PropTypes.string,
  submitOnClick: PropTypes.bool,
  submitOnEnter: PropTypes.bool,
};

SearchDropDownComponent.defaultProps = {
  buttonText: '',
  canSubmit: false,
  debounceRate: 200,
  formatSuggestions: false,
  getInputValue: undefined,
  shrinkToColumn: false,
  startingValue: '',
  submitOnClick: false,
  submitOnEnter: false,
};
