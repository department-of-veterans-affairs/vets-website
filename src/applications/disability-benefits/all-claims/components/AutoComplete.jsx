import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import debounce from 'lodash/debounce';
import { fullStringSimilaritySearch } from 'platform/forms-system/src/js/utilities/addDisabilitiesStringSearch';

const INSTRUCTIONS =
  'When autocomplete results are available use up and down arrows to review and enter to select. Touch device users, explore by touch or with swipe gestures.';

const createFreeTextItem = val => `Enter your condition as "${val}"`;

const AutoComplete = ({
  availableResults,
  debounceTime,
  formData,
  label,
  onChange,
}) => {
  const [value, setValue] = useState(formData);
  const [results, setResults] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [ariaLiveText, setAriaLiveText] = useState('');

  const inputRef = useRef(null);
  const resultsRef = useRef([]);

  const debouncedSearch = useRef(
    debounce(async inputValue => {
      const freeTextResult = createFreeTextItem(inputValue);
      const searchResults = fullStringSimilaritySearch(
        inputValue,
        availableResults,
      );
      const updatedResults = [freeTextResult, ...searchResults];
      setResults(updatedResults);
      setActiveIndex(0);

      const resultCount = updatedResults.length;
      const makePlural = resultCount > 1 ? 's' : '';
      setAriaLiveText(
        `${resultCount} result${makePlural}. ${freeTextResult}, (1 of ${resultCount})`,
      );
    }, debounceTime),
  ).current;

  const closeList = () => {
    debouncedSearch.cancel();
    setResults([]);
    setActiveIndex(null);
  };

  const handleInputChange = inputValue => {
    setValue(inputValue);
    onChange(inputValue);

    if (!inputValue) {
      closeList();
      setAriaLiveText('Input is empty. Please enter a condition.');
      return;
    }

    debouncedSearch(inputValue);
  };

  const scrollIntoView = index => {
    const activeResult = resultsRef.current[index];
    if (activeResult) {
      activeResult.scrollIntoView({
        block: 'nearest',
        behavior: 'auto',
      });
    }
  };

  const navigateList = (e, adjustment) => {
    e.preventDefault();
    const newIndex = activeIndex + adjustment;

    if (newIndex < 0 || newIndex > results.length - 1) {
      return;
    }

    setActiveIndex(newIndex);
    setAriaLiveText(
      `${results[newIndex]}, (${newIndex + 1} of ${results.length})`,
    );
    scrollIntoView(newIndex);
  };

  const selectResult = result => {
    const newValue = result === createFreeTextItem(value) ? value : result;
    setValue(newValue);
    onChange(newValue);
    setAriaLiveText(`${newValue} is selected`);
    closeList();

    inputRef.current.shadowRoot.querySelector('input').focus();
  };

  const handleKeyDown = e => {
    if (e.key === 'ArrowDown') {
      navigateList(e, 1);
    } else if (e.key === 'ArrowUp') {
      navigateList(e, -1);
    } else if (e.key === 'Enter' && results.length) {
      selectResult(results[activeIndex]);
    } else if (e.key === 'Escape') {
      closeList();
    }
  };

  return (
    <div className="cc-autocomplete">
      <VaTextInput
        label={label}
        required
        value={value}
        onInput={e => handleInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => setTimeout(closeList, 100)}
        onFocus={() => {
          if (value) {
            debouncedSearch(value);
          }
        }}
        message-aria-describedby={!value ? INSTRUCTIONS : null}
        data-testid="autocomplete-input"
        ref={inputRef}
      />
      {results.length > 0 && (
        <>
          <ul
            className="cc-autocomplete__list"
            aria-hidden="true"
            data-testid="autocomplete-list"
          >
            {results.map((result, index) => (
              <li
                key={result}
                ref={el => {
                  resultsRef.current[index] = el;
                }}
                onClick={() => selectResult(result)}
                onKeyDown={handleKeyDown}
                className={`cc-autocomplete__option ${
                  activeIndex === index ? 'cc-autocomplete__option--active' : ''
                }`}
                onMouseEnter={() => setActiveIndex(index)}
                role="option"
                aria-selected={activeIndex === index}
                data-testid={`autocomplete-option-${index}`}
              >
                {result}
              </li>
            ))}
          </ul>
          <p
            aria-live="polite"
            aria-atomic="true"
            className="vads-u-visibility--screen-reader"
          >
            {ariaLiveText}
          </p>
        </>
      )}
    </div>
  );
};

AutoComplete.propTypes = {
  availableResults: PropTypes.array,
  debounceTime: PropTypes.number,
  formData: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
};

export default AutoComplete;
