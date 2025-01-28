import React from 'react';
import PropTypes from 'prop-types';
import DownshiftClear from './DownshiftClear';
import DownshiftCaret from './DownshiftCaret';

function InputControlsContainer({
  inputId,
  isOpen,
  showDownCaret,
  openMenu,
  closeMenu,
  showClearButton,
  onClearClick,
}) {
  return (
    <div id={`${inputId}-input-controls-container`}>
      <DownshiftClear
        showClearButton={showClearButton}
        onClearClick={onClearClick}
        inputId={inputId}
      />
      <DownshiftCaret
        isOpen={isOpen}
        showDownCaret={showDownCaret}
        openMenu={openMenu}
        closeMenu={closeMenu}
        inputId={inputId}
      />
    </div>
  );
}

InputControlsContainer.propTypes = {
  closeMenu: PropTypes.func.isRequired,
  inputId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  openMenu: PropTypes.func.isRequired,
  showClearButton: PropTypes.bool.isRequired,
  showDownCaret: PropTypes.bool.isRequired,
  onClearClick: PropTypes.func.isRequired,
};

export default InputControlsContainer;
