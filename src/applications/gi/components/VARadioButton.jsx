import React from 'react';
import PropTypes from 'prop-types';
import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

/**
 * Benefit type page
 *
 * @param {String} radioLabel - Text Displayed at the top of the radio buttons.
 * @param {String} initialValue - initial value of the radio button
 * @param {Object} options - subtask options
 * @param {Function} onRadioOptionSelected - updates subtask options
 * @returns {JSX.Element}
 */
const VARadioButton = ({ radioLabel, options, onRadioOptionSelected }) => (
  <VaRadio
    enable-analytics
    label={radioLabel}
    onRadioOptionSelected={onRadioOptionSelected}
  >
    {options.map(({ value, label }) => (
      <VaRadioOption key={value} id={value} value={value} label={label} />
    ))}
  </VaRadio>
);

VARadioButton.propTypes = {
  initialValue: PropTypes.string.isRequired,
  radioLabel: PropTypes.string.isRequired,
  onRadioOptionSelected: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
  ),
};

export default VARadioButton;
