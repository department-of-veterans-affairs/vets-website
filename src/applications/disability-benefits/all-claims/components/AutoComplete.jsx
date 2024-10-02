import React, { useState } from 'react';
import { fullStringSimilaritySearch } from 'platform/forms-system/src/js/utilities/addDisabilitiesStringSearch';

const AutoCompleteWrapper = props => (
  <AutoComplete
    availableResults={props.uiSchema['ui:options'].disabilityLabels}
    label={props.uiSchema['ui:title']}
    formData={props.formData}
    onChange={props.onChange}
  />
);

const AutoComplete = ({ formData, label, availableResults, onChange }) => {
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
      selectItem(results[activeIndex]);
    }
  };

  const handleItemClick = item => {
    selectItem(item);
  };

  const handleBlur = () => {
    setTimeout(() => setIsOpen(false));
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
        onBlur={handleBlur}
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
            style={{ maxHeight: 440, overflowY: 'auto' }}
          >
            {results.map((item, index) => (
              <li
                key={item}
                onClick={() => handleItemClick(item)}
                onKeyDown={event => {
                  if (event.key === 'Enter') selectItem(item);
                }}
                className={`cc-combobox__option ${
                  activeIndex === index ? 'cc-combobox__option--active' : ''
                }`}
                style={{ cursor: 'pointer' }}
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

export default AutoCompleteWrapper;
