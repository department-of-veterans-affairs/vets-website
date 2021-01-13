import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import classNames from 'classnames';
import sortListByFuzzyMatch from 'platform/forms-system/src/js/utilities/fuzzy-matching';

const Typeahead = props => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const { idSchema } = props;
  const id = idSchema.$id;

  const getInput = (inputData, uiSchema) => {
    if (inputData && inputData.widget === 'autosuggest') {
      return inputData.label;
    }

    if (typeof inputData !== 'object' && inputData) {
      const uiOptions = uiSchema['ui:options'];

      if (!uiOptions.labels) {
        return inputData;
      }

      if (uiOptions.labels[inputData]) {
        return uiOptions.labels[inputData];
      }
    }
    return '';
  };

  const getSuggestions = (options, value) => {
    if (value) {
      const uiOptions = props.uiSchema['ui:options'];
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
      const item = getItemFromInput(inputValue, props.uiSchema['ui:options']);
      props.onChange(item);
      setInput(inputValue);
      setSuggestions(getSuggestions(suggestions, inputValue));
    } else if (inputValue === '') {
      props.onChange();
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
    props.onBlur(props.idSchema.$id);
  };

  useEffect(() => {
    const fetchInputData = getInput(props.formData, props.uiSchema);
    setInput(fetchInputData);

    const options = props.uiSchema['ui:options'].getOptions;
    const fetchedsuggestions = getSuggestions(options, input);
    setSuggestions(fetchedsuggestions);

    if (input && input.length > 3) {
      const item = getItemFromInput(input, props.uiSchema['ui:options']);
      props.onChange(item);
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
              id,
              name: id,
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
  schema: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  idSchema: PropTypes.shape({
    $id: PropTypes.string,
  }),
};

export default Typeahead;
