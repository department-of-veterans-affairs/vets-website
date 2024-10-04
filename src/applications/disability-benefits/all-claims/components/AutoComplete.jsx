import React, { useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { fullStringSimilaritySearch } from 'platform/forms-system/src/js/utilities/addDisabilitiesStringSearch';

const instructions =
  'When autocomplete results are available use up and down arrows to review and enter to select. Touch device users, explore by touch or with swipe gestures.';

const AutoComplete = ({
  availableResults,
  debounceTime,
  formData,
  label,
  onChange,
}) => {
  const [value, setValue] = useState(formData);
  const [results, setResults] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [resultAnnouncement, setResultAnnouncement] = useState('');

  const resultsRef = useRef([]);

  const debouncedSearch = useMemo(
    () => {
      let timeout;
      return inputValue => {
        clearTimeout(timeout);
        return new Promise(resolve => {
          timeout = setTimeout(() => {
            resolve(fullStringSimilaritySearch(inputValue, availableResults));
          }, debounceTime);
        });
      };
    },
    [availableResults, debounceTime],
  );

  const closeDropdown = () => {
    setIsOpen(false);
    setResults([]);
  };

  const selectItem = item => {
    const selection =
      item === `Enter your condition as "${value}"` ? value : item;
    setValue(selection);
    onChange(selection);
    closeDropdown();
  };

  const searchAndUpdateResults = async inputValue => {
    const searchResults = await debouncedSearch(inputValue);
    setResults([`Enter your condition as "${inputValue}"`, ...searchResults]);
    setIsOpen(true);
    setActiveIndex(0);

    setTimeout(() => {
      setResultAnnouncement(
        `${searchResults.length + 1} result${
          searchResults.length + 1 > 1 ? 's' : ''
        } available for "${inputValue}"`,
      );
    }, 1500);
  };

  const handleInputChange = async event => {
    const inputValue = event.target.value;
    setValue(inputValue);
    onChange(inputValue);

    if (!inputValue) {
      closeDropdown();
      return;
    }

    searchAndUpdateResults(inputValue);
  };

  const scrollIntoView = index => {
    const activeItem = resultsRef.current[index];
    if (activeItem) {
      activeItem.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  };

  const navigateList = (e, direction) => {
    e.preventDefault();
    const newIndex =
      direction === 'down'
        ? Math.min(activeIndex + 1, results.length - 1)
        : Math.max(activeIndex - 1, 0);
    setActiveIndex(newIndex);
    scrollIntoView(newIndex);
  };

  const handleKeyDown = e => {
    if (e.key === 'ArrowDown') {
      navigateList(e, 'down');
    } else if (e.key === 'ArrowUp') {
      navigateList(e, 'up');
    } else if (e.key === 'Enter' && results.length) {
      selectItem(results[activeIndex]);
    } else if (e.key === 'Escape') {
      closeDropdown();
    }
  };

  return (
    <div className="cc-autocomplete">
      <VaTextInput
        label={label}
        required
        value={value}
        onInput={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={() => setTimeout(closeDropdown, 100)}
        onFocus={async () => {
          if (value) {
            searchAndUpdateResults(value);
          }
        }}
        role="combobox"
        aria-activedescendant={
          isOpen ? `autocomplete-option-${activeIndex}` : null
        }
        aria-expanded={isOpen}
        aria-controls="autocomplete-list"
        aria-autocomplete="list"
        message-aria-describedby={value?.length > 0 ? null : instructions}
        data-testid="autocomplete-input"
      />
      {isOpen &&
        results.length > 0 && (
          <ul
            role="listbox"
            className="cc-autocomplete__list"
            id="autocomplete-list"
          >
            {results.map((item, index) => (
              <li
                key={item}
                ref={el => {
                  resultsRef.current[index] = el;
                }}
                onClick={() => selectItem(item)}
                onKeyDown={handleKeyDown}
                className={`cc-autocomplete__option ${
                  activeIndex === index ? 'cc-autocomplete__option--active' : ''
                }`}
                onMouseEnter={() => setActiveIndex(index)}
                id={`autocomplete-option-${index}`}
                role="option"
                aria-selected={activeIndex === index}
                data-testid={`autocomplete-option-${index}`}
              >
                {item}
              </li>
            ))}
            <div role="alert" className="vads-u-visibility--screen-reader">
              {resultAnnouncement}
            </div>
          </ul>
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
