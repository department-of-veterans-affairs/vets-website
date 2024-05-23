import React from 'react';
import PropTypes from 'prop-types';
import { VaCheckboxGroup } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

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
const VACheckboxButton = ({
  ariaDescribedby,
  radioLabel,
  initialValue,
  name,
  options,
  onVaValueChange,
}) => (
  <VaCheckboxGroup
    class="vads-u-margin-y--4"
    enable-analytics
    label={radioLabel}
    onVaValueChange={target => {
      onVaValueChange(target, name);
    }}
    ariaDescribedby={ariaDescribedby || `${name}_radio`}
    uswds
  >
    {options.map(({ value, label }) => (
      <va-checkbox
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
  </VaCheckboxGroup>
);

VACheckboxButton.propTypes = {
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

export default VACheckboxButton;
