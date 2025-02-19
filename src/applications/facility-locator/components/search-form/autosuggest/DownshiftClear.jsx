/* eslint-disable @department-of-veterans-affairs/prefer-button-component */
import PropTypes from 'prop-types';
import React from 'react';

function DownshiftClear({ showClearButton, onClearClick, inputId }) {
  if (!showClearButton) {
    return null;
  }
  return (
    <button
      type="button"
      className="input-with-clear-button"
      id={`clear-${inputId}`}
      aria-label="Clear input"
      onClick={onClearClick}
      data-testid="clear-button"
    >
      <va-icon icon="close" size="3" />
    </button>
  );
}

DownshiftClear.propTypes = {
  inputId: PropTypes.string.isRequired,
  onClearClick: PropTypes.func.isRequired,
  showClearButton: PropTypes.bool,
};

export default DownshiftClear;
