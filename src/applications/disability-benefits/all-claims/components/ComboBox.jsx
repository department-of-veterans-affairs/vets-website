// Description: ComboBox component for the disability benefits form.
import React from 'react';
import PropTypes from 'prop-types';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { fullStringSimilaritySearch } from 'platform/forms-system/src/js/utilities/addDisabilitiesStringSearch';

const COMBOBOX_LIST_MAX_HEIGHT = '440px';
const MAX_NUM_DISABILITY_SUGGESTIONS = 20;
const THRESHOLD = 0.5;

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
      searchTerm: '',
      input: '',
      value: '',
      highlightedIndex: 0,
      ariaLive1: '',
      ariaLive2: '',
      filteredOptions: [],
    };
    this.inputRef = React.createRef();
    this.listRef = React.createRef();
  }

  // Triggers updates to the list of items on state change
  componentDidUpdate(prevProps, prevState) {
    this.updateFilterOptions(prevState);
  }

  handleSearchChange = e => {
    const { bump } = this.state;
    const newTextValue = e.target.value;
    this.setState({
      searchTerm: newTextValue,
      bump: !bump,
      input: newTextValue,
    });
    this.props.onChange(newTextValue);
  };

  // update highlight class
  handleMouseEnter(e, optionIndex) {
    this.setState({ highlightedIndex: optionIndex });
  }

  // Filters list of conditions based on free-text input
  filterOptions = () => {
    const { searchTerm, value, bump } = this.state;
    const options = this.disabilitiesArr;
    const startsWith = options.filter(a =>
      a.toLowerCase().startsWith(searchTerm.toLowerCase()),
    );
    let filtered = fullStringSimilaritySearch(searchTerm, options, THRESHOLD);
    filtered = Array.from(new Set([...startsWith, ...filtered]));
    filtered = filtered.splice(0, MAX_NUM_DISABILITY_SUGGESTIONS);
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

  // Click handler for a list item
  selectOption(option) {
    this.setState({
      value: option,
      searchTerm: option,
      filteredOptions: [],
      highlightedIndex: 0,
    });
    this.inputRef.current.focus();
    const { onChange } = this.props;
    onChange(option);
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
    const { highlightedIndex, searchTerm, value } = this.state;

    if (option === value) {
      return null;
    }

    let classNameStr = 'cc-combobox__option cc-combobox__option--free';
    if (highlightedIndex === 0) {
      classNameStr += ' cc-combobox__option--active';
    }
    return (
      <span
        key={0}
        className={classNameStr}
        onClick={() => {
          this.selectOption(option);
        }}
        style={{ cursor: 'pointer' }}
        tabIndex={0}
        onMouseEnter={evt => {
          this.handleMouseEnter(evt, 0);
        }}
        onKeyDown={() => null}
        label="new-condition-option"
        role="option"
        aria-selected={searchTerm === option}
      >
        Enter your condition as "
        <span style={{ fontWeight: 'bold' }}>{option}</span>"
      </span>
    );
  }

  render() {
    const { searchTerm, ariaLive1, ariaLive2, filteredOptions } = this.state;
    return (
      <div className="cc-combobox">
        <VaTextInput
          message-aria-describedby="What new condition do you want to claim?"
          name="combobox-input"
          value={this.state.value}
          onInput={this.handleSearchChange}
          onChange={this.handleSearchChange}
          ref={this.inputRef}
        />
        <div
          className={
            filteredOptions.length > 0
              ? 'cc-combobox__list cc-combobox__list--open'
              : 'cc-combobox__list'
          }
          style={{ maxHeight: COMBOBOX_LIST_MAX_HEIGHT }}
          role="listbox"
          ref={this.listRef}
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
                <span
                  key={index}
                  className={classNameStr}
                  onClick={() => {
                    this.selectOption(option);
                  }}
                  style={{ cursor: 'pointer' }}
                  tabIndex={0}
                  onMouseEnter={e => {
                    this.handleMouseEnter(e, optionIndex);
                  }}
                  onKeyDown={() => null}
                  label={option}
                  role="option"
                  aria-selected={this.state.input === option}
                >
                  {option}
                </span>
              );
            })}
        </div>

        <div
          className="cc-combobox__status vads-u-visibility--screen-reader"
          role="alert"
          aria-live="polite"
          aria-atomic="true"
          id="1"
        >
          {ariaLive1}
        </div>
        <div
          className="cc-combobox__status vads-u-visibility--screen-reader"
          role="alert"
          aria-live="polite"
          aria-atomic="true"
          id="live_sr_results2"
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

// TODO: flesh this out
ComboBox.propTypes = {
  uiSchema: PropTypes.any,
  onChange: PropTypes.func,
};
