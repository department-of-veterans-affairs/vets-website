// Description: ComboBox component for the disability benefits form.
import React from 'react';
import PropTypes from 'prop-types';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { fullStringSimilaritySearch } from 'platform/forms-system/src/js/utilities/addDisabilitiesStringSearch';

const COMBOBOX_LIST_MAX_HEIGHT = '440px';
const defaultHighlightedIndex = -1;
// helper function for results string. No `this.` so not in class.
const getScreenReaderResults = (searchTerm, value, numResults) => {
  let results = numResults;
  const isFreeTextDrawn = searchTerm.length && searchTerm !== value;
  if (isFreeTextDrawn) {
    results += 1;
  }
  if (results === 1) {
    return '1 result available.';
  }
  return `${results} results available.`;
};

// This is a combobox component that is used in the revisedAddDisabilities page.
// Originally, the addDisabilities page used the AutosuggestField component from the platform-forms-system package.
// A new component was created to make suggestions to the veteran more understandable when selecting a new condition to claim.
// Search functions for use with this component are located in:
// src/platform/forms-system/src/js/utilities/addDisabilitiesStringSearch.js
export class ComboBox extends React.Component {
  constructor(props) {
    super(props);
    // is there a cleaner way to pass this in?
    this.disabilitiesArr = props.uiSchema['ui:options'].listItems;
    this.state = {
      bump: false,
      // Autopopulate input with existing form data:
      searchTerm: props.formData,
      value: props.formData,
      highlightedIndex: defaultHighlightedIndex,
      ariaLive1: '',
      ariaLive2: '',
      filteredOptions: [],
    };
    this.inputRef = React.createRef();
    this.listRef = React.createRef();
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClickOutsideList, true);
  }

  // Triggers updates to the list of items on state change
  componentDidUpdate(prevProps, prevState) {
    this.updateFilterOptions(prevState);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutsideList, true);
  }

  // Handler for closing the list when a user clicks outside of it
  handleClickOutsideList = e => {
    if (this.listRef.current && !this.listRef.current.contains(e.target)) {
      const { searchTerm } = this.state;
      this.setState({
        value: searchTerm,
        filteredOptions: [],
      });
      this.sendFocusToInput(this.inputRef);
    }
  };

  // handler for main form input
  handleSearchChange = e => {
    const { bump } = this.state;
    const newTextValue = e.target.value;
    // this.filterOptions();
    this.setState({
      searchTerm: newTextValue,
      bump: !bump,
    });
    this.props.onChange(newTextValue);
    // send focus back to input after selection in case user wants to append something else
    this.sendFocusToInput(this.inputRef);
  };

  // Handler for the blue background highlight class.
  handleMouseEnter(e, optionIndex) {
    this.setState({ highlightedIndex: optionIndex });
  }

  sendFocusToInput = ref => {
    const { shadowRoot } = ref.current;
    const input = shadowRoot.querySelector('input');
    input.focus();
  };

  // Keyboard handling for combobox list options
  handleKeyPress = e => {
    const { highlightedIndex, searchTerm } = this.state;
    const list = this.listRef.current;
    let index = highlightedIndex;

    switch (e.key) {
      // On Tab, user input should remain as-is, list should close, focus goes to save button.
      case 'Tab':
        if (list.children.length) {
          this.setState({
            value: searchTerm,
            searchTerm,
            filteredOptions: [],
            highlightedIndex: defaultHighlightedIndex,
          });
        }
        break;
      // Up and Down arrow keys should navigate to the respective next item in the list.
      case 'ArrowUp':
        // if user is in first item of the list and arrows up, should return to input field
        if (index === 0) {
          this.sendFocusToInput(this.inputRef);
          this.setState({ highlightedIndex: -1 });
        } else {
          index = this.decrementIndex(index);
          this.scrollIntoView(index);
          this.setState({ highlightedIndex: index });
          this.optionFocus(index);
        }
        e.preventDefault();
        break;
      case 'ArrowDown':
        index = this.incrementIndex(index);
        this.scrollIntoView(index);
        this.setState({ highlightedIndex: index });
        this.optionFocus(index);
        e.preventDefault();
        break;
      // On Enter, select the highlighted option and close the list. Focus on text input.
      case 'Enter':
        e.preventDefault();
        if (index === -1) {
          this.selectOption(searchTerm);
        } else {
          this.selectOptionWithKeyboard(e, index, list, searchTerm);
        }
        break;
      // On Escape, user input should remain as-is, list should collapse. Focus on text input.
      case 'Escape':
        this.setState({
          value: searchTerm,
          searchTerm,
          filteredOptions: [],
          highlightedIndex: defaultHighlightedIndex,
        });
        this.sendFocusToInput(this.inputRef);
        e.preventDefault();
        break;
      // All other cases treat as regular user input into the text field.
      default:
        // focus goes to input box by default
        this.sendFocusToInput(this.inputRef);
        // highlight dynamic free text option
        this.setState({
          highlightedIndex: defaultHighlightedIndex,
        });
        break;
    }
  };

  // Filters list of conditions based on free-text input
  filterOptions = () => {
    const { searchTerm, value, bump } = this.state;
    const options = this.disabilitiesArr;
    let filtered = fullStringSimilaritySearch(searchTerm, options);
    if (searchTerm.length === 0) {
      filtered = [];
    }
    if (searchTerm === value) {
      filtered = [];
    }
    let ariaLive1;
    let ariaLive2;
    if (bump) {
      ariaLive1 = getScreenReaderResults(searchTerm, value, filtered.length);
      ariaLive2 = '';
    } else {
      ariaLive1 = '';
      ariaLive2 = getScreenReaderResults(searchTerm, value, filtered.length);
    }
    this.setState({
      filteredOptions: filtered,
      ariaLive1,
      ariaLive2,
    });
  };

  // Scroll helper for keyboard arrow interactions with list items
  scrollIntoView = index => {
    const list = this.listRef.current;
    const currentItem = list.children[index];
    if (currentItem) {
      const { scrollTop, clientHeight } = list;
      const { offsetTop, clientHeight: itemHeight } = currentItem;
      const isItemFullyVisible =
        offsetTop >= scrollTop &&
        offsetTop + itemHeight <= scrollTop + clientHeight;
      if (!isItemFullyVisible) {
        currentItem.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    }
  };

  // Helpers for arrow key navigation
  decrementIndex = index => {
    if (index > 0) {
      return index - 1;
    }
    return index;
  };

  incrementIndex = index => {
    const { filteredOptions } = this.state;
    const maxIndex = filteredOptions.length;
    if (index < maxIndex) {
      return index + 1;
    }
    return index;
  };

  optionFocus(index) {
    const focusOption = document.getElementById(`option-${index}`);
    focusOption.focus();
  }

  // Click handler for a list item
  selectOption(option) {
    this.setState({
      value: option,
      searchTerm: option,
      filteredOptions: [],
      highlightedIndex: defaultHighlightedIndex,
    });
    const { onChange } = this.props;
    onChange(option);
    // Send focus to input element for additional user input.
    this.sendFocusToInput(this.inputRef);
  }

  // Keyboard handler for a list item. Need to check index against list for selection via keyboard
  selectOptionWithKeyboard(e, index, list, searchTerm) {
    if (index > 0) {
      this.selectOption(list.children[index].innerText);
    } else if (index === 0) {
      this.selectOption(searchTerm);
    }
  }

  // Handler for updating the visible list of items when state changes
  updateFilterOptions(prevState) {
    if (prevState.searchTerm !== this.state.searchTerm) {
      this.filterOptions();
    }
    if (prevState.value !== '' && this.state.value === '') {
      this.setState({ searchTerm: '' });
    }
  }

  // Creates the dynamic element for free text user entry.
  drawFreeTextOption(option) {
    const { highlightedIndex, value } = this.state;

    if (option === value || option.length < 1) {
      return null;
    }

    let classNameStr = 'cc-combobox__option cc-combobox__option--free';
    if (highlightedIndex === 0) {
      classNameStr += ' cc-combobox__option--active';
    }
    return (
      <li
        key={0}
        className={classNameStr}
        onClick={() => {
          this.selectOption(option);
        }}
        id="option-0"
        style={{ cursor: 'pointer' }}
        tabIndex={0}
        onMouseEnter={e => {
          this.handleMouseEnter(e, 0);
        }}
        onKeyDown={this.handleKeyPress}
        label="new-condition-option"
        role="option"
        aria-selected={this.state.highlightedIndex === 0 ? 'true' : 'false'}
      >
        Enter your condition as "
        <span style={{ fontWeight: 'bold' }}>{option}</span>"
      </li>
    );
  }

  render() {
    const { searchTerm, ariaLive1, ariaLive2, filteredOptions } = this.state;
    const autocompleteHelperText = `
      When autocomplete results are available use up and down arrows to
      review and enter to select. Touch device users, explore by touch or
      with swipe gestures.
    `;

    return (
      <div className="cc-combobox">
        <VaTextInput
          label={this.props.uiSchema['ui:title']}
          required
          name="combobox-input"
          id={this.props.idSchema.$id}
          value={this.state.value}
          onInput={this.handleSearchChange}
          onChange={this.handleSearchChange}
          onKeyDown={this.handleKeyPress}
          ref={this.inputRef}
          message-aria-describedby={autocompleteHelperText}
        />
        <ul
          className={
            filteredOptions.length > 0
              ? 'cc-combobox__list cc-combobox__list--open'
              : 'cc-combobox__list'
          }
          style={{ maxHeight: COMBOBOX_LIST_MAX_HEIGHT }}
          role="listbox"
          ref={this.listRef}
          aria-label="List of matching conditions"
          id="combobox-list"
          aria-activedescendant={
            filteredOptions.length > 0
              ? `option-${this.state.highlightedIndex}`
              : null
          }
          tabIndex={-1}
        >
          {this.drawFreeTextOption(searchTerm)}
          {filteredOptions &&
            filteredOptions.map((option, index) => {
              const optionIndex = index + 1;
              let classNameStr = 'cc-combobox__option';
              if (optionIndex === this.state.highlightedIndex) {
                classNameStr += ' cc-combobox__option--active';
              }
              return (
                <li
                  key={optionIndex}
                  className={classNameStr}
                  onClick={() => {
                    this.selectOption(option);
                  }}
                  style={{ cursor: 'pointer' }}
                  tabIndex={0}
                  onMouseEnter={e => {
                    this.handleMouseEnter(e, optionIndex);
                  }}
                  onKeyDown={this.handleKeyPress}
                  label={option}
                  role="option"
                  aria-selected={
                    optionIndex === this.state.highlightedIndex
                      ? 'true'
                      : 'false'
                  }
                  id={`option-${optionIndex}`}
                >
                  {option}
                </li>
              );
            })}
        </ul>

        <div
          className="cc-combobox__status vads-u-visibility--screen-reader"
          role="alert"
          aria-live="polite"
          aria-atomic="true"
          id={`${this.props.idSchema.$id}-live-sr-results1`}
        >
          {ariaLive1}
        </div>
        <div
          className="cc-combobox__status vads-u-visibility--screen-reader"
          role="alert"
          aria-live="polite"
          aria-atomic="true"
          id={`${this.props.idSchema.$id}-live-sr-results2`}
        >
          {ariaLive2}
        </div>
        <span className="vads-u-visibility--screen-reader">
          When autocomplete results are available use up and down arrows to
          review and enter to select. Touch device users, explore by touch or
          with swipe gestures.
        </span>
      </div>
    );
  }
}

ComboBox.propTypes = {
  formData: PropTypes.string,
  idSchema: PropTypes.object,
  uiSchema: PropTypes.object,
  onChange: PropTypes.func,
};
