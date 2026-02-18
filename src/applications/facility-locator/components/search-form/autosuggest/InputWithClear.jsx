import PropTypes from 'prop-types';
import React from 'react';
import InputControlsContainer from './InputControlsContainer';

/**
 * @typedef {{inputId:String, onClearClick: ()=>void, className?: String, otherProps:any}} InputWithClearProps
 */

/**
 * Input with clear is a full width input with a clear button overlayed inside it.
 * The width of the input is 100% of the parent container. The parent container.
 * The id of the input and the clear button are set to the inputId prop.
 * This is an uncontrolled component, so you must handle the clear via the onClearClick prop and the ref.
 * @param {InputWithClearProps} props  - as defined in the propTypes
 * @param {React.MutableRefObject} ref - passed to the input
 * @returns
 */

function InputWithClear({
  downshiftInputProps = {},
  getInputProps,
  getToggleButtonProps,
  inputId,
  inputRef,
  className,
  onClearClick,
  isOpen,
  showDownCaret,
  showClearButton,
  dropdownIsOpen,
  dropdownId,
}) {
  return (
    <div className={className}>
      <div className="input-with-clear-container vads-u-width--full">
        {/* 
            cannot use a va-text-input because shadow DOM won't allow placement 
            of the button inside the input and also won't allow extending the input
            to 100% width.
         */}
        <input
          className="input-with-clear vads-u-width--full"
          {...getInputProps({ ref: inputRef, ...downshiftInputProps })}
          aria-labelledby={undefined}
          data-testid={`${inputId}-input-with-clear`}
          aria-expanded={dropdownIsOpen}
          role="combobox"
          aria-controls={dropdownId}
        />
        <InputControlsContainer
          isOpen={isOpen}
          showDownCaret={showDownCaret}
          showClearButton={showClearButton}
          getToggleButtonProps={getToggleButtonProps}
          onClearClick={onClearClick}
          inputId={inputId}
        />
      </div>
    </div>
  );
}

InputWithClear.propTypes = {
  getInputProps: PropTypes.func.isRequired,
  getToggleButtonProps: PropTypes.func.isRequired,
  inputId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  showClearButton: PropTypes.bool.isRequired,
  showDownCaret: PropTypes.bool.isRequired,
  onClearClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  dropdownIsOpen: PropTypes.bool,
  dropdownId: PropTypes.string,
  downshiftInputProps: PropTypes.object,
  inputRef: PropTypes.any,
  // others not specified, may be passed from function
};

export default InputWithClear;
