import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { fullStringSimilaritySearch } from 'platform/forms-system/src/js/utilities/addDisabilitiesStringSearch';

const AutoComplete = ({ availableResults, formData, label, onChange }) => {
  const [value, setValue] = useState(formData);
  const [results, setResults] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const selectItem = item => {
    const selection =
      item === `Enter your condition as "${value}"` ? value : item;
    setValue(selection);
    onChange(selection);
    setIsOpen(false);
    setResults([]);
  };

  const handleInputChange = event => {
    const inputValue = event.target.value;

    setValue(inputValue);
    onChange(inputValue);

    if (inputValue) {
      const searchResults = fullStringSimilaritySearch(
        inputValue,
        availableResults,
      );
      setResults([`Enter your condition as "${inputValue}"`, ...searchResults]);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
    setActiveIndex(0);
  };

  const handleKeyDown = e => {
    if (e.key === 'ArrowDown') {
      setActiveIndex(prevIndex => Math.min(prevIndex + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      setActiveIndex(prevIndex => Math.max(prevIndex - 1, 0));
    } else if (e.key === 'Enter' && results.length) {
      selectItem(results[activeIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'Tab') {
      onChange(value);
    }
  };

  return (
    <div className="cc-combobox">
      <va-text-input
        label={label}
        required
        name="autocomplete-input"
        value={value}
        onInput={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={() => setTimeout(() => setIsOpen(false), 100)}
        aria-expanded={isOpen}
        aria-controls="autocomplete-list"
        role="combobox"
        aria-autocomplete="list"
      />
      {isOpen &&
        results.length > 0 && (
          <ul
            id="autocomplete-list"
            role="listbox"
            className={`cc-combobox__list ${
              isOpen ? 'cc-combobox__list--open' : ''
            }`}
          >
            {results.map((item, index) => (
              <li
                key={item}
                onClick={() => selectItem(item)}
                onKeyDown={handleKeyDown}
                className={`cc-combobox__option ${
                  activeIndex === index ? 'cc-combobox__option--active' : ''
                } ${index === 0 ? 'cc-combobox__option--free' : ''}`}
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
