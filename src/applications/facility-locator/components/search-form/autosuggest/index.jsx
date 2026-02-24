import React from 'react';
import classNames from 'classnames';
// TODO: downshift-v9 is pinned to 9.0.8 in package.json. Versions 9.1.0+
// break jsdom tests (React.useId colons in querySelector) and 9.3.2 throws
// on synthetic items not in the items array (getItemAndIndex validation).
// Unpin once https://github.com/downshift-js/downshift/pull/1636 merges
// and getItemAndIndex is fixed, or refactor AutosuggestOptions to stop
// passing synthetic placeholder items to getItemProps.
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
  inputValue,
  itemToString = toDisplay,
  onInputValueChange,
  // input props
  onClearClick,
  hintText = null,
  inputContainerClassName = 'input-container', // allows to work with fixed width from facility-locator
  inputError,
  inputId = 'autosuggest-input',
  inputRef,
  label,
  labelSibling = null,
  showDownCaret = true,
  // props from Downshift to pass to the input
  downshiftInputProps,
  // options for the autosuggest to show
  options,
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
  useProgressiveDisclosure,
  AutosuggestOptionComponent = AutosuggestOption,
  showOptionsRestriction = undefined,
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
    onInputValueChange,
    inputValue,
    isItemDisabled,
    stateReducer: keepDataOnBlur ? srKeepOnBlur : stateReducer,
  });

  const inputClearClick = () => {
    onClearClick();
    selectItem(null);
  };

  let shouldBeShown = isOpen;

  if (showOptionsRestriction !== undefined) {
    shouldBeShown = isOpen && showOptionsRestriction;
  }

  const { id } = getMenuProps();

  return (
    <div
      id={`${inputId}-autosuggest-container`}
      className={classNames('autosuggest-container', 'vads-u-width--full', {
        'usa-input-error': showError,
      })}
      data-testid="autosuggest-container"
    >
      <div
        className={`${inputId}-autosuggest-label-container ${
          useProgressiveDisclosure ? 'fl-sm-desktop' : ''
        }`}
      >
        <label className={`${inputId}-label`} {...getLabelProps()}>
          {label}
          {hintText && <span className="usa-hint">{hintText}</span>}
        </label>
        {labelSibling}
      </div>
      {inputError}
      <div className="autosuggest-input-container">
        <InputWithClear
          dropdownIsOpen={shouldBeShown}
          getInputProps={getInputProps}
          getToggleButtonProps={getToggleButtonProps}
          className={inputContainerClassName}
          inputId={inputId}
          inputRef={inputRef}
          isOpen={isOpen}
          showDownCaret={showDownCaret}
          showClearButton={!!inputValue}
          onClearClick={inputClearClick}
          downshiftInputProps={downshiftInputProps}
          dropdownId={id}
        />
        <AutosuggestOptions
          getItemProps={getItemProps}
          highlightedIndex={highlightedIndex}
          options={options}
          isShown={shouldBeShown}
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
