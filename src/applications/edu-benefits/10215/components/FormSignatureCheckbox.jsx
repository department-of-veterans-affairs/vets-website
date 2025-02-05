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
  const [checkboxError, setCheckboxError] = useState(null);

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
      className="vads-u-margin-top--3"
    >
      {checkboxDescription && <p slot="description">{checkboxDescription}</p>}
    </VaCheckbox>
  );
};

FormSignatureCheckbox.propTypes = {
  checked: PropTypes.bool.isRequired,
  setChecked: PropTypes.func.isRequired,
  showError: PropTypes.bool.isRequired,
  checkboxDescription: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  checkboxLabel: PropTypes.string,
  required: PropTypes.bool,
};

FormSignatureCheckbox.defaultProps = {
  checkboxLabel:
    'I certify the information above is correct and true to the best of my knowledge and belief.',
  required: true,
};

export default FormSignatureCheckbox;
