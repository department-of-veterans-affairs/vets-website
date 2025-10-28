import React, { useState, useEffect } from 'react';
import {
  VaTextInput,
  VaCheckbox,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';

/**
 * @param {string} props.error - Error message
 * @param {boolean} props.required - Whether the field is required
 * @param {Object} props.childrenProps - Props from the forms system
 */
export default function EligibleIndividualsField({
  error,
  required,
  childrenProps,
}) {
  const { formData = {}, onChange } = childrenProps || {};
  const [shouldShowTextFields, setShouldShowTextFields] = useState(
    !formData.unlimitedIndividuals,
  );

  useEffect(
    () => {
      setShouldShowTextFields(!formData.unlimitedIndividuals);
    },
    [formData.unlimitedIndividuals],
  );

  const handleTextInputChange = event => {
    const { value } = event.target;
    const newFormData = {
      ...formData,
      eligibleIndividuals: value,
    };
    if (value !== '') {
      const newVal = value.replace(/,/g, '');
      const numValue = parseInt(newVal, 10);
      newFormData.unlimitedIndividuals = numValue >= 99999;
    }

    onChange(newFormData);
  };

  const handleCheckboxChange = event => {
    const isUnlimited = event.target.checked;
    const newFormData = {
      ...formData,
      unlimitedIndividuals: isUnlimited,
    };

    if (isUnlimited) {
      newFormData.eligibleIndividuals = '';
      setShouldShowTextFields(false);
    } else {
      setShouldShowTextFields(true);
    }

    onChange(newFormData);
  };

  const isUnlimited = Boolean(formData.unlimitedIndividuals);
  const textValue = formData.eligibleIndividuals || '';

  const errorMessage = error && !isUnlimited ? error : undefined;

  return (
    <div className="eligible-individuals-field container">
      {!shouldShowTextFields && (
        <div>
          <p>
            How many eligible individuals will your school support through
            Yellow Ribbon contributions?{' '}
            <span className="vads-u-color--secondary-dark">(*Required)</span>
          </p>
        </div>
      )}
      {shouldShowTextFields && (
        <VaTextInput
          label="How many eligible individuals will your school support through Yellow Ribbon contributions?"
          hint="Note: The number of individuals must match the maximum number of students in the contribution details later in the form."
          value={textValue}
          onInput={handleTextInputChange}
          disabled={isUnlimited}
          {...errorMessage && { error: errorMessage }}
          className="vads-u-margin-bottom--2"
          required={required && !isUnlimited}
          type="number"
        />
      )}
      <VaCheckbox
        label="My school will support an unlimited number of individuals"
        checked={isUnlimited}
        onVaChange={handleCheckboxChange}
        className="vads-u-margin-bottom--3"
      />
    </div>
  );
}

EligibleIndividualsField.propTypes = {
  childrenProps: PropTypes.object.isRequired,
  error: PropTypes.string,
  required: PropTypes.bool,
};
