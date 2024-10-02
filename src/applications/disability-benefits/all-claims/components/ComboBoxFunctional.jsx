// Description: ComboBox component for the disability benefits form.
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { fullStringSimilaritySearch } from 'platform/forms-system/src/js/utilities/addDisabilitiesStringSearch';

const COMBOBOX_LIST_MAX_HEIGHT = '440px';
const defaultHighlightedIndex = -1;

const getScreenReaderResults = (
  searchTerm,
  value,
  numResults,
  selectionMade,
) => {
  let results = numResults;
  const isFreeTextDrawn = !selectionMade && searchTerm?.length;
  if (isFreeTextDrawn) {
    results += 1;
  }
  if (results === 1) {
    return '1 result available.';
  }
  return `${results} results available.`;
};

// This is a combobox component that is used in the addDisabilities page.
// Originally, the addDisabilities page used the AutosuggestField component from the platform-forms-system package.
// A new component was created to make suggestions to the veteran more understandable when selecting a new condition to claim.
// Search functions for use with this component are located in:
// src/platform/forms-system/src/js/utilities/addDisabilitiesStringSearch.js
const ComboBox = props => {
  // is there a cleaner way to pass this in?
  const disabilitiesArr = props.uiSchema['ui:options'].listItems;
  const [bump, setBump] = useState(false);
  // Autopopulate input with existing form data:
  const [searchTerm, setSearchTerm] = useState(props.formData);
  const [value, setValue] = useState(props.formData);
  const [highlightedIndex, setHighlightedIndex] = useState(
    defaultHighlightedIndex,
  );
  const [ariaLive1, setAriaLive1] = useState('');
  const [ariaLive2, setAriaLive2] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [selectionMade, setSelectionMade] = useState(true);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const sendFocusToInput = ref => {
    const { shadowRoot } = ref.current;
    const input = shadowRoot?.querySelector('input');
    input?.focus();
  };

  // Handler for closing the list when a user clicks outside of it
  const handleClickOutsideList = e => {
    if (listRef.current && !listRef.current.contains(e.target)) {
      if (searchTerm) {
        setValue(searchTerm);
      }
      setFilteredOptions([]);
      setSelectionMade(true);
      sendFocusToInput(inputRef);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutsideList, true);
    return () => {
      document.removeEventListener('click', handleClickOutsideList, true);
    };
  }, []);

  // Filters list of conditions based on free-text input
  const filterOptions = () => {
    const options = disabilitiesArr;
    let filtered;

    if (searchTerm?.length === 0 || (selectionMade && searchTerm === value)) {
      filtered = [];
    } else {
      filtered = fullStringSimilaritySearch(searchTerm, options);
    }

    let aria1;
    let aria2;
    if (bump) {
      aria1 = getScreenReaderResults(
        searchTerm,
        value,
        filtered.length,
        selectionMade,
      );
      aria2 = '';
    } else {
      aria1 = '';
      aria2 = getScreenReaderResults(
        searchTerm,
        value,
        filtered.length,
        selectionMade,
      );
    }
    setFilteredOptions(filtered);
    setAriaLive1(aria1);
    setAriaLive2(aria2);
  };

  // Handler for updating the visible list of items when state changes
  useEffect(
    () => {
      filterOptions();
    },
    [searchTerm, value],
  );

  // handler for main form input
  const handleSearchChange = e => {
    const newTextValue = e.target.value;
    setSearchTerm(newTextValue);
    setBump(!bump);
    setSelectionMade(false);
    props.onChange(newTextValue);
    // send focus back to input after selection in case user wants to append something else
    sendFocusToInput(inputRef);
  };

  // Handler for the blue background highlight class.
  const handleMouseEnter = (e, optionIndex) => {
    setHighlightedIndex(optionIndex);
  };

  // Scroll helper for keyboard arrow interactions with list items
  const scrollIntoView = index => {
    const list = listRef.current;
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
  const decrementIndex = index => {
    if (index > 0) {
      return index - 1;
    }
    return index;
  };

  const incrementIndex = index => {
    const maxIndex = filteredOptions.length;
    if (index < maxIndex) {
      return index + 1;
    }
    return index;
  };

  const optionFocus = index => {
    const focusOption = document.getElementById(`option-${index}`);
    focusOption.focus();
  };

  // Click handler for a list item
  const selectOption = option => {
    setValue(option);
    setSearchTerm(option);
    setFilteredOptions([]);
    setHighlightedIndex(defaultHighlightedIndex);
    setSelectionMade(true);
    const { onChange } = props;
    onChange(option);
    // Send focus to input element for additional user input.
    sendFocusToInput(inputRef);
  };

  // Keyboard handler for a list item. Need to check index against list for selection via keyboard
  const selectOptionWithKeyboard = (e, index, list, search) => {
    if (index > 0) {
      selectOption(list.children[index].textContent);
    } else if (index === 0) {
      selectOption(search);
    }
  };

  // Keyboard handling for combobox list options
  const handleKeyPress = e => {
    const list = listRef.current;
    let index = highlightedIndex;

    switch (e.key) {
      // On Tab, user input should remain as-is, list should close, focus goes to save button.
      case 'Tab':
        if (list.children.length) {
          setValue(searchTerm);
          setSearchTerm(searchTerm);
          setFilteredOptions([]);
          setHighlightedIndex(defaultHighlightedIndex);
          setSelectionMade(true);
        }
        break;
      // Up and Down arrow keys should navigate to the respective next item in the list.
      case 'ArrowUp':
        // if user is in first item of the list and arrows up, should return to input field
        if (index === 0) {
          sendFocusToInput(inputRef);
          setHighlightedIndex(-1);
        } else {
          index = decrementIndex(index);
          scrollIntoView(index);
          setHighlightedIndex(index);
          optionFocus(index);
        }
        e.preventDefault();
        break;
      case 'ArrowDown':
        index = incrementIndex(index);
        scrollIntoView(index);
        setHighlightedIndex(index);
        optionFocus(index);
        e.preventDefault();
        break;
      // On Enter, select the highlighted option and close the list. Focus on text input.
      case 'Enter':
        e.preventDefault();
        if (index === -1) {
          selectOption(searchTerm);
        } else {
          selectOptionWithKeyboard(e, index, list, searchTerm);
        }
        break;
      // On Escape, user input should remain as-is, list should collapse. Focus on text input.
      case 'Escape':
        setValue(searchTerm);
        setSearchTerm(searchTerm);
        setFilteredOptions([]);
        setHighlightedIndex(defaultHighlightedIndex);
        setSelectionMade(true);
        sendFocusToInput(inputRef);
        e.preventDefault();
        break;
      // All other cases treat as regular user input into the text field.
      default:
        // focus goes to input box by default
        sendFocusToInput(inputRef);
        // highlight dynamic free text option
        setHighlightedIndex(defaultHighlightedIndex);
        break;
    }
  };

  // Creates the dynamic element for free text user entry.
  const drawFreeTextOption = option => {
    if (selectionMade || !option?.length) {
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
          selectOption(option);
        }}
        id="option-0"
        style={{ cursor: 'pointer' }}
        tabIndex={0}
        onMouseEnter={e => {
          handleMouseEnter(e, 0);
        }}
        onKeyDown={handleKeyPress}
        label="new-condition-option"
        role="option"
        aria-selected={highlightedIndex === 0 ? 'true' : 'false'}
      >
        Enter your condition as "
        <span style={{ fontWeight: 'bold' }}>{option}</span>"
      </li>
    );
  };

  const autocompleteHelperText =
    'When autocomplete results are available use up and down arrows to review and enter to select. Touch device users, explore by touch or with swipe gestures.';

  return (
    <div className="cc-combobox">
      <VaTextInput
        label={props.uiSchema['ui:title']}
        required
        name="combobox-input"
        id={props.idSchema.$id}
        value={value}
        onInput={handleSearchChange}
        onChange={handleSearchChange}
        onKeyDown={handleKeyPress}
        ref={inputRef}
        message-aria-describedby={autocompleteHelperText}
        data-testid="combobox-input"
      />
      <ul
        className={
          filteredOptions.length > 0
            ? 'cc-combobox__list cc-combobox__list--open'
            : 'cc-combobox__list'
        }
        style={{ maxHeight: COMBOBOX_LIST_MAX_HEIGHT }}
        role="listbox"
        ref={listRef}
        aria-label="List of matching conditions"
        id="combobox-list"
        aria-activedescendant={
          filteredOptions.length > 0 ? `option-${highlightedIndex}` : null
        }
        tabIndex={-1}
      >
        {drawFreeTextOption(searchTerm)}
        {filteredOptions &&
          filteredOptions.map((option, index) => {
            const optionIndex = index + 1;
            let classNameStr = 'cc-combobox__option';
            if (optionIndex === highlightedIndex) {
              classNameStr += ' cc-combobox__option--active';
            }
            return (
              <li
                key={optionIndex}
                className={classNameStr}
                onClick={() => {
                  selectOption(option);
                }}
                style={{ cursor: 'pointer' }}
                tabIndex={0}
                onMouseEnter={e => {
                  handleMouseEnter(e, optionIndex);
                }}
                onKeyDown={handleKeyPress}
                label={option}
                role="option"
                aria-selected={
                  optionIndex === highlightedIndex ? 'true' : 'false'
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
        id={`${props.idSchema.$id}-live-sr-results1`}
      >
        {ariaLive1}
      </div>
      <div
        className="cc-combobox__status vads-u-visibility--screen-reader"
        role="alert"
        aria-live="polite"
        aria-atomic="true"
        id={`${props.idSchema.$id}-live-sr-results2`}
      >
        {ariaLive2}
      </div>
      <span className="vads-u-visibility--screen-reader">
        When autocomplete results are available use up and down arrows to review
        and enter to select. Touch device users, explore by touch or with swipe
        gestures.
      </span>
    </div>
  );
};

ComboBox.propTypes = {
  formData: PropTypes.string,
  idSchema: PropTypes.object,
  uiSchema: PropTypes.object,
  onChange: PropTypes.func,
};

export default ComboBox;
