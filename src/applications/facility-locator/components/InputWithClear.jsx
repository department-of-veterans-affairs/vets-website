import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';

function InputWithClear({ setId, onClearClick, ...otherProps }, ref) {
  return (
    <div className="flex-1">
      <input
        id={setId}
        className="flex-1 p-2 text-base"
        {...otherProps}
        ref={ref}
      />
      {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component */}
      <button
        type="button"
        className="clear-button"
        id={`clear-${setId}`}
        aria-label="Clear input"
        onClick={onClearClick}
      >
        <va-icon name="close" size="3" />
      </button>
    </div>
  );
}

InputWithClear.propTypes = {
  setId: PropTypes.string.isRequired,
  onClearClick: PropTypes.func.isRequired,
  // others not specified, may be passed from function
};

export default forwardRef(InputWithClear);
