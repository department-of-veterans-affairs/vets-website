import React, { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { fullStringSimilaritySearch } from 'platform/forms-system/src/js/utilities/addDisabilitiesStringSearch';
import debounce from 'lodash/debounce';

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
  const [resultsCountAnnouncement, setResultsCountAnnouncement] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeResultAnnouncement, setActiveResultAnnouncement] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const resultsRef = useRef([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const delayAnnouncement = useCallback(
    debounce((freeTextResult, resultCount) => {
      setResultsCountAnnouncement(
        `${resultCount} result${
          resultCount > 1 ? 's' : ''
        }. ${freeTextResult}, (1 of ${resultCount})"`,
      );
    }, 1500),
    [],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSearch = useCallback(
    debounce(async inputValue => {
      const searchResults = fullStringSimilaritySearch(
        inputValue,
        availableResults,
      );
      const freeTextResult = `Enter your condition as "${inputValue}"`;
      setResults([freeTextResult, ...searchResults]);
      setIsOpen(true);
      setActiveIndex(0);

      const resultCount = 1 + searchResults.length;
      delayAnnouncement(freeTextResult, resultCount);
    }, debounceTime),
    [availableResults, debounceTime],
  );

  const closeList = () => {
    debounceSearch.cancel();
    delayAnnouncement.cancel();
    setResults([]);
    setResultsCountAnnouncement('');
    setActiveResultAnnouncement('');
    setIsOpen(false);
  };

  const handleInputChange = event => {
    const inputValue = event.target.value;
    setValue(inputValue);
    onChange(inputValue);

    if (!inputValue) {
      closeList();
      return;
    }

    debounceSearch(inputValue);
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
    setActiveResultAnnouncement(
      `${results[newIndex]}, (${newIndex + 1} of ${results.length})`,
    );
    scrollIntoView(newIndex);
  };

  const selectItem = item => {
    const selection =
      item === `Enter your condition as "${value}"` ? value : item;
    setValue(selection);
    onChange(selection);
    closeList();
  };

  const handleKeyDown = e => {
    if (e.key === 'ArrowDown') {
      navigateList(e, 'down');
    } else if (e.key === 'ArrowUp') {
      navigateList(e, 'up');
    } else if (e.key === 'Enter' && results.length) {
      selectItem(results[activeIndex]);
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
        onInput={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={() => setTimeout(closeList, 100)}
        onFocus={() => {
          if (value) {
            debounceSearch(value);
          }
        }}
        message-aria-describedby={value?.length > 0 ? null : instructions}
        data-testid="autocomplete-input"
      />
      {isOpen &&
        results.length > 0 && (
          <>
            <ul
              className="cc-autocomplete__list"
              data-testid="autocomplete-list"
              role="listbox"
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
                    activeIndex === index
                      ? 'cc-autocomplete__option--active'
                      : ''
                  }`}
                  onMouseEnter={() => setActiveIndex(index)}
                  role="option"
                  aria-selected={activeIndex === index}
                  data-testid={`autocomplete-option-${index}`}
                >
                  {item}
                </li>
              ))}
            </ul>
            <div role="alert" className="vads-u-visibility--screen-reader">
              {resultsCountAnnouncement}
            </div>
            <div role="alert" className="vads-u-visibility--screen-reader">
              {activeResultAnnouncement}
            </div>
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
