/* eslint-disable @department-of-veterans-affairs/prefer-button-component */
import React from 'react';
import PropTypes from 'prop-types';

function DownshiftCaret({
  getToggleButtonProps,
  isOpen,
  showDownCaret,
  inputId,
}) {
  if (!showDownCaret) {
    return null;
  }
  return (
    <div id={`downshift-caret-holder-${inputId}`} data-testid="down-caret">
      <button
        id={`downshift-caret-${inputId}`}
        aria-label={isOpen ? 'close dropdown' : 'open dropdown'}
        className="downshift-caret-button"
        {...getToggleButtonProps()}
        type="button"
      >
        {isOpen ? (
          <va-icon icon="expand_less" size="3" />
        ) : (
          <va-icon icon="expand_more" size="3" />
        )}
      </button>
    </div>
  );
}

DownshiftCaret.propTypes = {
  getToggleButtonProps: PropTypes.func.isRequired,
  inputId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  showDownCaret: PropTypes.bool,
};
export default DownshiftCaret;
