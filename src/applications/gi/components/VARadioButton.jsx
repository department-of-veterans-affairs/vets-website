import React from 'react';
import PropTypes from 'prop-types';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

/**
 * VA Radio button with VA Radio Option component.
 *
 * @param {String} radioLabel - Text Displayed at the top of the radio buttons.
 * @param {String} initialValue - initial value of the radio button
 * @param {Object} options - subtask options
 * @param {Function} onVaValueChange - updates subtask options
 * @returns {JSX.Element}
 */
const VARadioButton = ({
  radioLabel,
  initialValue,
  options,
  onVaValueChange,
}) => (
  <VaRadio
    enable-analytics
    label={radioLabel}
    onVaValueChange={onVaValueChange}
  >
    {options.map(({ value, label }) => (
      <va-radio-option
        key={value}
        id={value}
        value={value}
        label={label}
        checked={value === initialValue}
      />
    ))}
  </VaRadio>
);

VARadioButton.propTypes = {
  initialValue: PropTypes.string.isRequired,
  radioLabel: PropTypes.string.isRequired,
  onVaValueChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
  ),
};

export default VARadioButton;
