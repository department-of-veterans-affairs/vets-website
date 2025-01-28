/* eslint-disable @department-of-veterans-affairs/prefer-button-component */
import React from 'react';
import PropTypes from 'prop-types';

function DownshiftCaret({
  isOpen,
  showDownCaret,
  openMenu,
  closeMenu,
  inputId,
}) {
  if (!showDownCaret) {
    return null;
  }
  return (
    <div id={`downshift-caret-holder-${inputId}`}>
      <button
        id={`downshift-caret-${inputId}`}
        aria-label={isOpen ? 'close dropdown' : 'open dropdown'}
        className="downshift-caret-button"
        onClick={() => (isOpen ? closeMenu() : openMenu())}
        type="button"
      >
        {isOpen ? (
          <va-icon icon="expand_more" size="3" />
        ) : (
          <va-icon icon="expand_less" size="3" />
        )}
      </button>
    </div>
  );
}

DownshiftCaret.propTypes = {
  closeMenu: PropTypes.func.isRequired,
  inputId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  openMenu: PropTypes.func.isRequired,
  showDownCaret: PropTypes.bool,
};
export default DownshiftCaret;
