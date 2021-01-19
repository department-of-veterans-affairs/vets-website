import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import classNames from 'classnames';
import sortListByFuzzyMatch from 'platform/forms-system/src/js/utilities/fuzzy-matching';

const Typeahead = ({ uiSchema, formData, onChange, onBlur, idSchema }) => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  // const getInput = useCallback(
  //   () => {
  //     if (formData && formData.widget === 'autosuggest') {
  //       return formData.label;
  //     }

  //     if (typeof formData !== 'object' && formData) {
  //       const uiOptions = uiSchema['ui:options'];

  //       if (!uiOptions.labels) {
  //         return formData;
  //       }

  //       if (uiOptions.labels[formData]) {
  //         return uiOptions.labels[formData];
  //       }
  //     }
  //     return '';
  //   },
  //   [formData, uiSchema],
  // );

  // const getSuggestions = useCallback(
  //   (options, value) => {
  //     if (value) {
  //       const uiOptions = uiSchema['ui:options'];
  //       return sortListByFuzzyMatch(value, options).slice(
  //         0,
  //         uiOptions.maxOptions,
  //       );
  //     }
  //     return options;
  //   },
  //   [uiSchema],
  // );

  const getInput = () => {
    if (formData && formData.widget === 'autosuggest') {
      return formData.label;
    }

    if (typeof formData !== 'object' && formData) {
      const uiOptions = uiSchema['ui:options'];

      if (!uiOptions.labels) {
        return formData;
      }

      if (uiOptions.labels[formData]) {
        return uiOptions.labels[formData];
      }
    }
    return '';
  };

  const getSuggestions = (options, value) => {
    if (value) {
      const uiOptions = uiSchema['ui:options'];
      return sortListByFuzzyMatch(value, options).slice(
        0,
        uiOptions.maxOptions,
      );
    }
    return options;
  };

  const getItemFromInput = (inputValue, uiOptions) => {
    const { inputTransformers } = uiOptions;

    return inputTransformers &&
      Array.isArray(inputTransformers) &&
      inputTransformers.length
      ? inputTransformers.reduce(
          (userInput, transformer) => transformer(userInput),
          inputValue,
        )
      : inputValue;
  };

  const handleInputValueChange = inputValue => {
    if (inputValue !== input) {
      const item = getItemFromInput(inputValue, uiSchema['ui:options']);
      onChange(item);
      setInput(inputValue);
      setSuggestions(getSuggestions(suggestions, inputValue));
    } else if (inputValue === '') {
      onChange();
      setInput(inputValue);
      setSuggestions(getSuggestions(suggestions, inputValue));
    }
  };

  const handleKeyDown = event => {
    const escapeKey = 27;
    if (event.keyCode === escapeKey) {
      setInput('');
    }
  };

  const handleBlur = () => {
    onBlur(idSchema.$id);
  };

  useEffect(() => {
    const fetchInputData = getInput();
    setInput(fetchInputData);

    const { getOptions } = uiSchema['ui:options'];
    const options = getOptions();

    const fetchedsuggestions = getSuggestions(options, input);
    setSuggestions(fetchedsuggestions);

    if (input && input.length > 3) {
      const item = getItemFromInput(input, uiSchema['ui:options']);
      onChange(item);
    }
  }, []);

  return (
    <Downshift
      onInputValueChange={handleInputValueChange}
      inputValue={input}
      selectedItem={input}
      onOuterClick={handleBlur}
      itemToString={item => (typeof item === 'string' ? item : item.label)}
      render={({
        getInputProps,
        getItemProps,
        isOpen,
        selectedItem,
        highlightedIndex,
      }) => (
        <div className="autosuggest-container">
          <input
            {...getInputProps({
              autoComplete: 'off',
              id: idSchema.$id,
              name: idSchema.$id,
              className: 'autosuggest-input',
              onBlur: isOpen ? undefined : handleBlur,
              onKeyDown: handleKeyDown,
            })}
          />
          {isOpen && (
            <div className="autosuggest-list" role="listbox">
              {suggestions.map((item, index) => (
                <div
                  {...getItemProps({ item })}
                  role="option"
                  aria-selected={selectedItem === item.label ? 'true' : 'false'}
                  className={classNames('autosuggest-item', {
                    'autosuggest-item-highlighted': highlightedIndex === index,
                    'autosuggest-item-selected': selectedItem === item.label,
                  })}
                  key={index}
                >
                  {item.label}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    />
  );
};

Typeahead.propTypes = {
  uiSchema: PropTypes.shape({
    'ui:options': PropTypes.shape({
      labels: PropTypes.object,
      getOptions: PropTypes.func.isRequired,
      maxOptions: PropTypes.number,
      inputTransformers: PropTypes.arrayOf(PropTypes.func),
    }),
    'ui:title': PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  }),
  formData: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  idSchema: PropTypes.shape({
    $id: PropTypes.string,
  }),
};

export default Typeahead;
