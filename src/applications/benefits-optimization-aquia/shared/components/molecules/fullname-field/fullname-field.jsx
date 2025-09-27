import PropTypes from 'prop-types';
import React from 'react';

import {
  firstNameSchema,
  lastNameSchema,
  middleNameSchema,
  suffixSchema,
} from '../../../schemas/name';
import { FormField } from '../../atoms';

/**
 * Full name field component for capturing person's complete name.
 * Provides separate inputs for first, middle, last name, and suffix.
 * Uses VA web components with integrated Zod validation.
 *
 * @component
 * @see [VA Text Input](https://design.va.gov/components/form/text-input)
 * @see [Form Field Component](../atoms/form-field.jsx)
 *
 * @param {Object} props - Component props
 * @param {Object} props.value - Current name value object
 * @param {string} [props.value.first] - First name
 * @param {string} [props.value.middle] - Middle name
 * @param {string} [props.value.last] - Last name
 * @param {string} [props.value.suffix] - Name suffix (Jr., Sr., III, etc.)
 * @param {Function} props.onChange - Change handler (fieldPath, value) => void
 * @param {Object} [props.errors={}] - Validation errors object
 * @param {boolean} [props.required=false] - Whether first and last name are required
 * @param {string} [props.legend='Your full name'] - Fieldset legend text
 * @param {boolean} [props.showSuffix=true] - Whether to show suffix field
 * @param {boolean} [props.forceShowError=false] - Force display of validation errors
 * @returns {JSX.Element} Full name fieldset with individual name fields
 *
 * @example
 * ```jsx
 * <FullnameField
 *   value={formData.fullName}
 *   onChange={handleFieldChange}
 *   errors={errors.fullName}
 *   required={true}
 *   legend="Veteran's full name"
 * />
 * ```
 */
export const FullnameField = ({
  value = {},
  onChange,
  errors = {},
  required = false,
  legend = 'Your full name',
  showSuffix = true,
  forceShowError = false,
}) => {
  // Ensure value is always an object, even if null/undefined is passed
  const safeValue = value || {};

  const handleNameChange = (fieldPath, fieldValue) => {
    const namePart = fieldPath.split('.').pop();

    const updatedFullName = {
      ...safeValue,
      [namePart]: fieldValue,
    };

    onChange('fullName', updatedFullName);
  };

  return (
    <fieldset className="vads-u-margin-bottom--2">
      <legend className="vads-u-font-weight--bold vads-u-margin-bottom--1">
        {legend}
      </legend>

      <FormField
        name="fullName.first"
        label="First name"
        schema={firstNameSchema}
        value={safeValue.first || ''}
        onChange={handleNameChange}
        required={required}
        error={errors?.first}
        forceShowError={forceShowError}
      />

      <FormField
        name="fullName.middle"
        label="Middle name"
        schema={middleNameSchema}
        value={safeValue.middle || ''}
        onChange={handleNameChange}
        error={errors?.middle}
        forceShowError={forceShowError}
      />

      <FormField
        name="fullName.last"
        label="Last name"
        schema={lastNameSchema}
        value={safeValue.last || ''}
        onChange={handleNameChange}
        required={required}
        error={errors?.last}
        forceShowError={forceShowError}
      />

      {showSuffix && (
        <FormField
          name="fullName.suffix"
          label="Suffix"
          schema={suffixSchema}
          value={safeValue.suffix || ''}
          onChange={handleNameChange}
          hint="Jr., Sr., III, etc."
          error={errors?.suffix}
          forceShowError={forceShowError}
        />
      )}
    </fieldset>
  );
};

FullnameField.propTypes = {
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    first: PropTypes.string,
    last: PropTypes.string,
    middle: PropTypes.string,
    suffix: PropTypes.string,
  }),
  forceShowError: PropTypes.bool,
  legend: PropTypes.string,
  required: PropTypes.bool,
  showSuffix: PropTypes.bool,
  value: PropTypes.shape({
    first: PropTypes.string,
    last: PropTypes.string,
    middle: PropTypes.string,
    suffix: PropTypes.string,
  }),
};
