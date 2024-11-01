import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import debounce from 'lodash/debounce';
import { fullStringSimilaritySearch } from 'platform/forms-system/src/js/utilities/addDisabilitiesStringSearch';

const INSTRUCTIONS =
  'When autocomplete results are available use up and down arrows to review and enter to select. Touch device users, explore by touch or with swipe gestures.';

const createFreeTextItem = val => `Enter your condition as "${val}"`;

const Autocomplete = ({
  availableResults,
  debounceDelay,
  formData,
  id,
  label,
  onChange,
}) => {
  const [value, setValue] = useState(formData);
  const [results, setResults] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [ariaLiveText, setAriaLiveText] = useState('');

  const inputRef = useRef(null);
  const resultsRef = useRef([]);

  // Delays screen reader result count reading to avoid interruption by input content reading
  const debouncedSetAriaLiveText = useRef(
    debounce((resultCount, freeTextResult) => {
      const makePlural = resultCount > 1 ? 's' : '';

      setAriaLiveText(
        `${resultCount} result${makePlural}. ${freeTextResult}, (1 of ${resultCount})`,
      );
    }, 700),
  ).current;

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

      debouncedSetAriaLiveText(updatedResults.length, freeTextResult);
    }, debounceDelay),
  ).current;

  const closeList = () => {
    debouncedSearch.cancel();
    debouncedSetAriaLiveText.cancel();
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
    activeResult?.scrollIntoView({
      block: 'nearest',
    });
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
    if (results.length > 0) {
      if (e.key === 'ArrowDown') {
        navigateList(e, 1);
      } else if (e.key === 'ArrowUp') {
        navigateList(e, -1);
      } else if (e.key === 'Enter') {
        selectResult(results[activeIndex]);
      } else if (e.key === 'Escape') {
        closeList();
      }
    }
  };

  const handleBlur = () => setTimeout(closeList, 200); // Enables clicking option from list

  return (
    <div className="cc-autocomplete">
      <VaTextInput
        data-testid="autocomplete-input"
        id={id}
        label={label}
        message-aria-describedby={!value ? INSTRUCTIONS : null}
        ref={inputRef}
        required
        value={value}
        onBlur={handleBlur}
        onFocus={() => value && debouncedSearch(value)}
        onInput={e => handleInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {results.length > 0 && (
        <ul
          aria-hidden="true"
          className="cc-autocomplete__list"
          data-testid="autocomplete-list"
        >
          {results.map((result, index) => (
            <li
              aria-selected={activeIndex === index}
              className={`cc-autocomplete__option ${
                activeIndex === index ? 'cc-autocomplete__option--active' : ''
              }`}
              key={result}
              ref={el => {
                resultsRef.current[index] = el;
              }}
              role="option"
              onClick={() => selectResult(result)}
              onKeyDown={handleKeyDown} // Keydown is handled on the input; this is never fired and prevents eslint error
              onMouseEnter={() => setActiveIndex(index)}
            >
              {result}
            </li>
          ))}
        </ul>
      )}
      <p aria-live="polite" className="vads-u-visibility--screen-reader">
        {ariaLiveText}
      </p>
    </div>
  );
};

Autocomplete.propTypes = {
  availableResults: PropTypes.array,
  debounceDelay: PropTypes.number,
  formData: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
};

export default Autocomplete;
