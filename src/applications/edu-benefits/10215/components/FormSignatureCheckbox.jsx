import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export const FormSignatureCheckbox = ({
  checked,
  setChecked,
  checkboxLabel,
  checkboxDescription,
  required,
  showError,
}) => {
  // Validation states
  const [checkboxError, setCheckboxError] = useState(null);

  // Checkbox validation
  useEffect(
    () => {
      setCheckboxError(
        required && !checked
          ? 'Please check the box to certify the information is correct'
          : null,
      );
    },
    [required, checked],
  );

  return (
    <VaCheckbox
      label={checkboxLabel}
      description={null}
      required={required}
      error={showError ? checkboxError : null}
      checked={checked}
      onVaChange={event => setChecked(event.target.checked)}
    >
      {checkboxDescription && <p slot="description">{checkboxDescription}</p>}
    </VaCheckbox>
  );
};

FormSignatureCheckbox.propTypes = {
  checked: PropTypes.bool.isRequired,
  setChecked: PropTypes.func.isRequired,
  // eslint-disable-next-line react/sort-prop-types
  showError: PropTypes.bool.isRequired,
  /**
   * The description for the checkbox input
   */
  checkboxDescription: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  /**
   * The label for the checkbox input
   */
  checkboxLabel: PropTypes.string,
  required: PropTypes.bool,
};

FormSignatureCheckbox.defaultProps = {
  checkboxLabel:
    'I certify the information above is correct and true to the best of my knowledge and belief.',
  required: true,
  // eslint-disable-next-line react/default-props-match-prop-types
};

export default FormSignatureCheckbox;
