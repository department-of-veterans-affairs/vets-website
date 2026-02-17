import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import debounce from 'lodash/debounce';
import { fullStringSimilaritySearch } from 'platform/forms-system/src/js/utilities/addDisabilitiesStringSearch';

const INSTRUCTIONS =
  'When autocomplete results are available use up and down arrows to review and enter to select. Touch device users, explore by touch or with swipe gestures.';

const createFreeTextItem = val => `Enter your condition as "${val}"`;

const focusOnInput = inputRef => {
  const inputEl = inputRef.current?.shadowRoot?.querySelector('input');
  inputEl?.focus();
};

const Autocomplete = ({
  availableResults,
  debounceDelay,
  formData,
  hint,
  id,
  label,
  onChange,
}) => {
  const [value, setValue] = useState(formData);
  const [results, setResults] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [ariaLiveText, setAriaLiveText] = useState('');

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const resultsRef = useRef([]);

  // Delays screen reader result count reading to avoid interruption by input content reading
  const debouncedSetAriaLiveText = useRef(
    debounce((resultCount, inputValue) => {
      const makePlural = resultCount > 1 ? 's' : '';

      setAriaLiveText(
        `${resultCount} result${makePlural}. ${inputValue}, (1 of ${resultCount})`,
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

      debouncedSetAriaLiveText(updatedResults.length, inputValue);
    }, debounceDelay),
  ).current;

  const closeList = useCallback(
    () => {
      debouncedSearch.cancel();
      debouncedSetAriaLiveText.cancel();
      setResults([]);
      setActiveIndex(null);
    },
    [debouncedSearch, debouncedSetAriaLiveText],
  );

  const handleInputChange = useCallback(
    inputValue => {
      const trimmed =
        typeof inputValue === 'string' ? inputValue.trim() : inputValue;

      setValue(inputValue);
      onChange(trimmed);

      if (!trimmed) {
        closeList();
        setAriaLiveText('Input is empty. Please enter a condition.');
        return;
      }

      debouncedSearch(trimmed);
    },
    [onChange, closeList, debouncedSearch],
  );

  const activateScrollToAndFocus = useCallback(index => {
    setActiveIndex(index);

    const activeEl = resultsRef.current[index];
    activeEl?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
    activeEl?.focus();
  }, []);

  const navigateList = useCallback(
    (e, adjustment) => {
      e.preventDefault();
      const newIndex = activeIndex + adjustment;
      if (newIndex > results.length - 1) {
        return;
      }

      if (newIndex < 1) {
        activateScrollToAndFocus(0);
        focusOnInput(inputRef);
      } else {
        activateScrollToAndFocus(newIndex);
      }
    },
    [activeIndex, results.length, activateScrollToAndFocus],
  );

  const selectResult = useCallback(
    result => {
      const initValue = result === createFreeTextItem(value) ? value : result;
      const newValue =
        typeof initValue === 'string' ? initValue.trim() : initValue;

      setValue(initValue);
      onChange(newValue);
      setAriaLiveText(`${newValue} is selected`);
      closeList();
      focusOnInput(inputRef);
    },
    [value, onChange, closeList],
  );

  const handleKeyDown = e => {
    if (results.length === 0) return;
    switch (e.key) {
      case 'ArrowDown':
        navigateList(e, 1);
        break;
      case 'ArrowUp':
        navigateList(e, -1);
        break;
      case 'Enter':
        selectResult(results[activeIndex]);
        break;
      case 'Escape':
        closeList();
        focusOnInput(inputRef);
        break;
      case 'Tab':
        closeList();
        break;
      default:
        focusOnInput(inputRef);
    }
  };

  const handleFocus = () => {
    if (value && results.length === 0) {
      debouncedSearch(value);
    }
  };

  // Keep local state in sync with external formData
  useEffect(() => setValue(formData), [formData]);

  // Cancel debounced functions on unmount to avoid setting state on an unmounted component
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
      debouncedSetAriaLiveText.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(
    () => {
      const handleClickOutside = event => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target)
        ) {
          closeList();
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    },
    [closeList],
  );

  return (
    <div className="cc-autocomplete" ref={containerRef}>
      <VaTextInput
        autocomplete="off"
        data-testid="autocomplete-input"
        id={id}
        label={label}
        hint={hint}
        message-aria-describedby={!value ? INSTRUCTIONS : null}
        ref={inputRef}
        required
        value={value}
        onFocus={handleFocus}
        onInput={e => handleInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {results.length > 0 && (
        <ul
          aria-activedescendant={`option-${activeIndex}`}
          className="cc-autocomplete__list"
          data-testid="autocomplete-list"
          role="listbox"
          tabIndex={-1}
          aria-label="List of matching conditions"
        >
          {results.map((result, index) => (
            <li
              aria-selected={activeIndex === index}
              className={`cc-autocomplete__option ${
                activeIndex === index ? 'cc-autocomplete__option--active' : ''
              }`}
              id={`option-${index}`}
              key={`${result}-${index}`} // Ensure every list item has a unique key
              ref={el => {
                resultsRef.current[index] = el;
              }}
              role="option"
              tabIndex={-1}
              onClick={() => selectResult(result)}
              onKeyDown={handleKeyDown} // Keydown is handled on the input; this is never fired and prevents eslint error
              onMouseMove={() => {
                if (index !== activeIndex) {
                  activateScrollToAndFocus(index);
                }
              }}
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
  hint: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
};

export default Autocomplete;
