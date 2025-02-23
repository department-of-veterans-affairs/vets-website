import React from 'react';
import classNames from 'classnames';
import { useCombobox } from 'downshift-v9';
import { itemToString as toDisplay } from './helpers';
import InputWithClear from './InputWithClear';
import AutosuggestOption from './AutosuggestOption';
import AutosuggestOptions from './AutosuggestOptions';
import './sass/autosuggest.scss';
import { AutosuggestProps } from '../../../types';
import { srClearOnBlur, srKeepOnBlur } from './StateReducer';

function Autosuggest({
  // downshift props
  handleOnSelect,
  defaultSelectedItem,
  inputValue,
  itemToString = toDisplay,
  onInputValueChange,
  // input props
  onClearClick,
  inputContainerClassName = 'input-container', // allows to work with fixed width from facility-locator
  inputId = 'autosuggest-input',
  inputError,
  label,
  labelSibling = null,
  showDownCaret = true,
  // props from Downshift to pass to the input
  downshiftInputProps,
  // options for the autosuggest to show
  options,
  minCharacters = 3, // only trigger update after n=3 characters
  noItemsMessage = 'No results found',
  shouldShowNoResults = true,
  // showError - use the usa-input-error class to show the error
  showError = false,
  // behavior check - should the input clear on escape - default is true
  keepDataOnBlur = false,
  isItemDisabled = (item, _index) => {
    return !!item.disabled; // can choose a different method to say which items are disabled
  },
  stateReducer = srClearOnBlur,
  isLoading = false,
  loadingMessage = '',
  AutosuggestOptionComponent = AutosuggestOption,
}) {
  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    selectItem,
  } = useCombobox({
    items: options,
    itemToString,
    inputId,
    onSelectedItemChange: handleOnSelect,
    defaultSelectedItem,
    onInputValueChange,
    inputValue,
    isItemDisabled,
    stateReducer: keepDataOnBlur ? srKeepOnBlur : stateReducer,
  });

  const inputClearClick = () => {
    onClearClick();
    selectItem(null);
  };

  return (
    <div
      id={`${inputId}-autosuggest-container`}
      className={classNames('autosuggest-container', 'vads-u-width--full', {
        'usa-input-error': showError,
      })}
    >
      <div className={`${inputId}-autosuggest-label-container`}>
        <label className={`${inputId}-label`} {...getLabelProps()}>
          {label}
        </label>
        {labelSibling}
      </div>
      {inputError}
      <div className="autosuggest-input-container">
        <InputWithClear
          getInputProps={getInputProps}
          getToggleButtonProps={getToggleButtonProps}
          className={inputContainerClassName}
          inputId={inputId}
          isOpen={isOpen}
          showDownCaret={showDownCaret}
          showClearButton={!!inputValue}
          onClearClick={inputClearClick}
          downshiftInputProps={downshiftInputProps}
        />
        <AutosuggestOptions
          getItemProps={getItemProps}
          highlightedIndex={highlightedIndex}
          options={options}
          isShown={isOpen && !!inputValue && inputValue.length >= minCharacters}
          itemToString={itemToString}
          noItemsMessage={noItemsMessage} // to display when no items are found - disabled item
          getMenuProps={getMenuProps}
          shouldShowNoResults={shouldShowNoResults}
          isLoading={isLoading}
          loadingMessage={loadingMessage}
          AutosuggestOptionComponent={AutosuggestOptionComponent}
        />
      </div>
    </div>
  );
}

Autosuggest.propTypes = AutosuggestProps;

export default Autosuggest;
