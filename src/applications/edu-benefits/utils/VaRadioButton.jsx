import React from 'react';
import PropTypes from 'prop-types';
import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

/**
 * VA Radio button with VA Radio Option component.
 *
 * @param {String} ariaDescribedby - ariaDescribedby of the radio button
 * @param {String} radioLabel - Text Displayed at the top of the radio buttons.
 * @param {String} initialValue - initial value of the radio button
 * @param {String} name - name of the radio button
 * @param {Object} options - subtask options
 * @param {Function} onVaValueChange - updates subtask options
 * @returns {JSX.Element}
 */
const VARadioButton = ({
  ariaDescribedby,
  radioLabel,
  initialValue,
  name,
  options,
  onVaValueChange,
}) => (
  <VaRadio
    class="vads-u-margin-y--4"
    enable-analytics
    label={radioLabel}
    onVaValueChange={onVaValueChange}
    ariaDescribedby={ariaDescribedby || `${name}_radio`}
  >
    {options.map(({ value, label }) => (
      <VaRadioOption
        key={value}
        class="vads-u-margin-y--3"
        name={name}
        label={label}
        id={`${name}_${value}`}
        value={value}
        checked={value === initialValue}
        ariaDescribedby={ariaDescribedby || `${name}_radio_options`}
      />
    ))}
  </VaRadio>
);

VARadioButton.propTypes = {
  initialValue: PropTypes.string.isRequired,
  radioLabel: PropTypes.string.isRequired,
  onVaValueChange: PropTypes.func.isRequired,
  ariaDescribedby: PropTypes.string,
  name: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
  ),
};

export default VARadioButton;
