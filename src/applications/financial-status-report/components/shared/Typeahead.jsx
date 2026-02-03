import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift-v9';
import classNames from 'classnames';
import sortListByFuzzyMatch from 'platform/forms-system/src/js/utilities/fuzzy-matching';

const Typeahead = ({ uiSchema, idSchema, formData, onChange, onBlur }) => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const getInput = useCallback(
    () => {
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
    },
    [formData, uiSchema],
  );

  const getSuggestions = useCallback(
    value => {
      const { getOptions, uiOptions } = uiSchema['ui:options'];
      const options = getOptions();

      if (options?.length && value) {
        return sortListByFuzzyMatch(value, options).slice(
          0,
          uiOptions?.maxOptions,
        );
      }
      return options;
    },
    [uiSchema],
  );

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
    } else if (inputValue === '') {
      onChange();
      setInput(inputValue);
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

  useEffect(
    () => {
      const fetchInputData = getInput();
      setInput(fetchInputData);

      const fetchedSuggestions = getSuggestions(input);
      setSuggestions(fetchedSuggestions);
    },
    [getInput, getSuggestions], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const renderOptions = ({
    getInputProps,
    getItemProps,
    isOpen,
    selectedItem,
    highlightedIndex,
  }) => {
    return (
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
            {suggestions?.map((item, index) => (
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
    );
  };

  return (
    <Downshift
      onInputValueChange={handleInputValueChange}
      inputValue={input}
      selectedItem={input}
      onOuterClick={handleBlur}
      itemToString={item => (typeof item === 'string' ? item : item.label)}
      render={data => renderOptions(data)}
    />
  );
};

Typeahead.propTypes = {
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  formData: PropTypes.string,
  idSchema: PropTypes.shape({
    $id: PropTypes.string,
  }),
  uiSchema: PropTypes.shape({
    'ui:title': PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    'ui:options': PropTypes.shape({
      labels: PropTypes.object,
      getOptions: PropTypes.func.isRequired,
      maxOptions: PropTypes.number,
      inputTransformers: PropTypes.arrayOf(PropTypes.func),
      idPrefix: PropTypes.string,
      uiOptions: PropTypes.object,
    }),
  }),
};

export default Typeahead;
