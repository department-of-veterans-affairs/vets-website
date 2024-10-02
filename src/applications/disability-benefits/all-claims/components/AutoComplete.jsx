import React, { useState, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { fullStringSimilaritySearch } from 'platform/forms-system/src/js/utilities/addDisabilitiesStringSearch';

const AutoComplete = ({ availableResults, formData, label, onChange }) => {
  const [value, setValue] = useState(formData);
  const [results, setResults] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const resultsRef = useRef([]);

  const debouncedSearch = useMemo(
    () => {
      let timeout;
      return inputValue => {
        clearTimeout(timeout);
        return new Promise(resolve => {
          timeout = setTimeout(() => {
            resolve(fullStringSimilaritySearch(inputValue, availableResults));
          }, 200);
        });
      };
    },
    [availableResults],
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

  const handleInputChange = async event => {
    const inputValue = event.target.value;
    setValue(inputValue);
    onChange(inputValue);

    if (inputValue) {
      const searchResults = await debouncedSearch(inputValue);
      setResults([`Enter your condition as "${inputValue}"`, ...searchResults]);
      setIsOpen(true);
    } else {
      closeDropdown();
    }

    setActiveIndex(0);
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
    } else if (e.key === 'Tab') {
      onChange(value);
    }
  };

  return (
    <div
      className="cc-autocomplete"
      role="combobox"
      aria-expanded={isOpen}
      aria-controls="autocomplete-list"
      aria-autocomplete="list"
    >
      <va-text-input
        label={label}
        required
        name="autocomplete-input"
        value={value}
        onInput={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={() => setTimeout(closeDropdown, 100)}
        data-testid="autocomplete-input"
      />
      {isOpen &&
        results.length > 0 && (
          <ul
            id="autocomplete-list"
            role="listbox"
            className="cc-autocomplete__list"
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
                role="option"
                aria-selected={activeIndex === index}
                tabIndex="0"
              >
                {item}
              </li>
            ))}
          </ul>
        )}
    </div>
  );
};

AutoComplete.propTypes = {
  availableResults: PropTypes.array,
  formData: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
};

const AutoCompleteWrapper = props => (
  <AutoComplete
    availableResults={props.uiSchema['ui:options'].disabilityLabels}
    label={props.uiSchema['ui:title']}
    formData={props.formData}
    onChange={props.onChange}
  />
);

AutoCompleteWrapper.propTypes = {
  formData: PropTypes.string,
  idSchema: PropTypes.object,
  uiSchema: PropTypes.object,
  onChange: PropTypes.func,
};

export default AutoCompleteWrapper;
