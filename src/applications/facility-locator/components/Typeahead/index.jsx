import React from 'react';
import classNames from 'classnames';
import Downshift from 'downshift';
import PropTypes from 'prop-types';
import { itemToString as toDisplay } from './helpers';
import InputWithClear from './InputWithClear';
import TypeaheadDropdownOptions from './TypeaheadDropdownOptions';
import './sass/typeahead.scss';

function Typeahead({
  // downshift props
  handleOnSelect,
  defaultSelectedItem,
  inputValue,
  itemToString = toDisplay,
  onInputValueChange,
  // input props
  inputClearClick,
  inputValueClearOnly,
  inputContainerClassName = 'input-container', // allows to work with fixed width from facility-locator
  inputId = 'typeahead-input',
  inputRef,
  inputError,
  label,
  labelSibling = null,
  showDownCaret = true,
  // props from Downshift to pass to the input
  downshiftInputProps,
  // options for the typeahead to show
  options,
  minCharacters = 3, // only trigger update after n=3 characters
  noItemsMessage = 'No results found',
  // showError - use the usa-input-error class to show the error
  showError = false,
  // behavior check - should the input clear on escape - default is true
  clearOnEscape = true,
  // should keep input value on blur/tab out - default is false
  keepDataOnBlur = false,
}) {
  // basic input functions onBlur and onKeydown that handle clearing on escape or when blurred (via tabs or clicks)
  let toClear = null;
  const onBlur = e => {
    // happens when the input is blurred
    const { value } = e.target;
    if (!value) {
      inputClearClick();
    }
    if (!keepDataOnBlur) {
      // there's a race condition for clear and setting the value on clicking on a option
      // in this verison of Downshift
      toClear = setTimeout(() => {
        inputValueClearOnly();
      }, 200);
    }
  };

  const onKeydown = e => {
    // keydown in the input
    if (e.key === 'Escape' && clearOnEscape) {
      e.preventDefault();
      e.stopPropagation();
      inputClearClick();
    }
  };

  return (
    <Downshift
      itemToString={itemToString}
      onChange={e => {
        // added for the race condition. There may be a timeout to clear for
        // resetting the input due to a blur event - This shouldn't occur
        if (toClear && keepDataOnBlur) {
          clearTimeout(toClear);
        }
        handleOnSelect(e);
      }}
      // These are the props from the old version of Downshift we use here, when updated, use the new props
      selectedItem={!window.Cypress ? defaultSelectedItem : undefined}
      defaultSelectedItem={window.Cypress ? defaultSelectedItem : undefined}
      // end of old props
      // this is passed to the input via the getInputProps
      inputValue={inputValue}
    >
      {({
        getInputProps,
        getItemProps,
        getLabelProps,
        getRootProps,
        isOpen,
        highlightedIndex,
        openMenu,
        closeMenu,
      }) => (
        <div
          id={`${inputId}-typeahead-container`}
          className={classNames('typeahead-container', 'vads-u-width--full', {
            'usa-input-error': showError,
          })}
        >
          <div id={`${inputId}-typeahead-label-container`}>
            <label
              id={`${inputId}-label`}
              {...getLabelProps({ htmlFor: inputId })}
            >
              {label}
            </label>
            {labelSibling}
          </div>
          {inputError}
          <div
            className="typeahead-input-container"
            {...getRootProps({}, { suppressRefError: true })}
          >
            <InputWithClear
              // getInputProps contains id: inputId
              {...getInputProps({
                ...downshiftInputProps,
                onChange: onInputValueChange,
                onBlur:
                  typeof downshiftInputProps.onBlur === 'function'
                    ? downshiftInputProps.onBlur
                    : onBlur,
                onKeyDown:
                  typeof downshiftInputProps.onKeyDown === 'function'
                    ? downshiftInputProps.onKeyDown
                    : onKeydown,
              })}
              className={inputContainerClassName}
              onClearClick={inputClearClick}
              ref={inputRef}
              inputId={inputId} // for the button id name
              isOpen={isOpen}
              showDownCaret={showDownCaret}
              openMenu={openMenu}
              closeMenu={closeMenu}
              optionsLength={options?.length || 0}
            />
            <TypeaheadDropdownOptions
              getItemProps={getItemProps}
              highlightedIndex={highlightedIndex}
              options={options}
              isShown={
                isOpen && !!inputValue && inputValue.length > minCharacters
              }
              itemToString={itemToString}
              noItemsMessage={noItemsMessage}
            />
          </div>
        </div>
      )}
    </Downshift>
  );
}

Typeahead.propTypes = {
  handleOnSelect: PropTypes.func.isRequired,
  inputClearClick: PropTypes.func.isRequired, // function to call when the clear button is clicked,
  inputValue: PropTypes.string.isRequired, // controlled component
  inputValueClearOnly: PropTypes.func.isRequired, // function to clear the input value only
  label: PropTypes.element.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  onInputValueChange: PropTypes.func.isRequired,
  clearOnEscape: PropTypes.bool, // optional flag to clear the input on escape
  defaultSelectedItem: PropTypes.object, // can be null
  downshiftInputProps: PropTypes.object, // props to pass to the input from downshift
  inputContainerClassName: PropTypes.string, // optional className for the input container
  inputError: PropTypes.element, // optional element to render an error message
  inputId: PropTypes.string, // defaults to 'typeahead-input'
  inputRef: PropTypes.object, // not required only if you programmatically need to focus the input or get something from it
  itemToString: PropTypes.func,
  keepDataOnBlur: PropTypes.bool, // optional flag to keep the input value on blur
  labelSibling: PropTypes.element, // optional element to render next to the label
  minCharacters: PropTypes.number, // optional minimum number of characters to start searching
  noItemsMessage: PropTypes.string, // message to show when no items are found
  showDownCaret: PropTypes.bool, // optional flag to show the down
  showError: PropTypes.bool, // optional flag to show the error state
  stateReducer: PropTypes.func, // optional function to modify the state of Downshift - e.g. handle escape to not clear
};

export default Typeahead;
