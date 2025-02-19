import React from 'react';
import PropTypes from 'prop-types';
import DownshiftClear from './DownshiftClear';
import DownshiftCaret from './DownshiftCaret';

function InputControlsContainer({
  getToggleButtonProps,
  inputId,
  isOpen,
  onClearClick,
  showDownCaret,
  showClearButton,
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
        inputId={inputId}
        getToggleButtonProps={getToggleButtonProps}
      />
    </div>
  );
}

InputControlsContainer.propTypes = {
  getToggleButtonProps: PropTypes.func.isRequired,
  inputId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  showClearButton: PropTypes.bool.isRequired,
  showDownCaret: PropTypes.bool.isRequired,
  onClearClick: PropTypes.func.isRequired,
};

export default InputControlsContainer;
