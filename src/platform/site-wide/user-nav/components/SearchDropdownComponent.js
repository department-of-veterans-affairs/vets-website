// March 2024: This file is duplicated from the search application (src/applications/search) because we
// converted the search app used on the page in /search/?query={query} to use web components
// The header cannot support web components yet due to its integration with TeamSites, so this is the original
// non-web-component version of the Search app
import React from 'react';
import PropTypes from 'prop-types';
import {
  isSearchTermValid,
} from '~/platform/utilities/search-utilities';

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
    buttonClassName: PropTypes.string,
    /**
     * A boolean value for whether or not the component has "submit" functionality
     * */
    canSubmit: PropTypes.bool,
    /**
     * A string value that will be prepended on each id
     * */
    id: PropTypes.string,
    /**
     * A string value that will be prepended to the classnames for the base component
     * */
    componentClassName: PropTypes.string,
    /**
     * A string value that will be prepended to the classnames for the container
     * */
    containerClassName: PropTypes.string,
    /**
     * A string value that will be prepended to the classnames for the input field
     * */
    inputClassName: PropTypes.string,
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
     * A function that is passed to retrieve the input for the search app component
     * */
    fetchInputValue: PropTypes.func,
    /**
     * A boolean value for whether or not the search button shall move underneath the input field when viewed on a small screen
     * */
    mobileResponsive: PropTypes.bool,
    /**
     * A string value for the default value of the input field.
     * */
    startingValue: PropTypes.string,
  };

  static defaultProps = {
    buttonText: '',
    canSubmit: false,
    id: '',
    debounceRate: 200,
    mobileResponsive: false,
    fetchInputValue: undefined,
    getInputValue: undefined,
    onInputSubmit: undefined,
    showButton: true,
    startingValue: '',
    submitOnClick: false,
    submitOnEnter: false,
    buttonClassName: '',
    componentClassName: '',
    containerClassName: '',
    inputClassName: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      activeIndex: undefined,
      ignoreBlur: false,
      inputValue: this.props.startingValue,
      isOpen: false,
      a11yStatusMessage: '',
      a11yLongStringMessage: '',
      displayA11yDescriptionFlag: undefined,
    };
  }

  componentDidMount() {
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
    clearTimeout(this.updateA11yTimeout);
  }

  handleInputChange = event => {
    // update the input value to the new value
    const inputValue = event.target.value;
    this.setState({
      inputValue,
      activeIndex: undefined,
    });
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
    const { isOpen, activeIndex } = this.state;
    const {
      canSubmit,
      onInputSubmit,
      submitOnEnter,
    } = this.props;

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
        this.setState({ isOpen: false });
      }
    }
  };

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

  // derive the ally status message for screen reader
  setA11yStatusMessage = () => {
    const {
      isOpen,
      activeIndex,
      inputValue,
    } = this.state;

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

    if (!isOpen) {
      this.setState({
        a11yStatusMessage: '',
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
      a11yStatusMessage,
      displayA11yDescriptionFlag,
      a11yLongStringMessage,
    } = this.state;

    const {
      componentClassName,
      containerClassName,
      buttonClassName,
      inputClassName,
      id,
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

    const validOpen = isOpen;

    return (
      <div
        id={`${id}-component`}
        className={`search-dropdown-component vads-u-display--flex vads-u-width--full ${mobileResponsiveClass} ${componentClassName}`}
      >
        <div
          className={`search-dropdown-container vads-u-width--full vads-u-flex-direction--column ${containerClassName}`}
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
            className={`vads-u-width--full search-dropdown-input-field ${inputClassName}`}
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
        </div>
        {/* only show the submit button if the component has submit capabilities */}
        {showButton &&
          canSubmit && (
            <button
              type="submit"
              className={`search-dropdown-submit-button vads-u-margin-right--1 ${buttonClassName}`}
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
                viewBox="2 0 20 22"
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
      </div>
    );
  }
}

export default SearchDropdownComponent;
