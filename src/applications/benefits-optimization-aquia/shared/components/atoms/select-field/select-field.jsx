import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';

/**
 * Select dropdown field using VA select v3 web component with simplified validation.
 * Provides accessible dropdown selection with consistent VA.gov styling.
 * Simplified to use parent-level validation through useFormSection.
 *
 * @component
 * @see [VA Select Component](https://design.va.gov/components/form/select)
 * @see [Web Components Catalog - Selection Fields](../docs/WEB_COMPONENTS_CATALOG.md#selection-fields)
 * @see [VA Adapter - Select Handling](../docs/WEB_COMPONENTS_CATALOG.md#component-specific-adapters)
 *
 * @param {Object} props - Component props
 * @param {string} props.name - Field name for form identification
 * @param {string} props.label - Label text displayed above the dropdown
 * @param {import('zod').ZodSchema} props.schema - Zod schema for validation (unused, kept for API compatibility)
 * @param {string} props.value - Currently selected value
 * @param {Function} props.onChange - Change handler function (name, value) => void
 * @param {Array<{value: string, label: string}>} props.options - Dropdown option items
 * @param {boolean} [props.required=false] - Whether selection is required
 * @param {string} [props.hint] - Additional help text for the user
 * @param {string} [props.error] - External error message to display
 * @param {boolean} [props.forceShowError=false] - Force display of validation errors
 * @returns {JSX.Element} VA select dropdown component with validation
 *
 * @example
 * ```jsx
 * <SelectField
 *   name="relationship"
 *   label="Relationship to Veteran"
 *   schema={relationshipSchema}
 *   value={formData.relationship}
 *   onChange={handleFieldChange}
 *   options={relationshipOptions}
 *   required
 * />
 * ```
 */
export const SelectField = ({
  name,
  label,
  schema: _schema,
  value,
  onChange,
  options,
  required = false,
  hint,
  error: externalError,
  forceShowError = false,
  ...props
}) => {
  const [touched, setTouched] = useState(false);

  const shouldShowError = (touched || forceShowError) && externalError;

  const handleChange = useCallback(
    e => {
      const newValue = e.target ? e.target.value : e.detail?.value;
      onChange(name, newValue);
    },
    [name, onChange],
  );

  const handleBlur = useCallback(() => {
    setTouched(true);
  }, []);

  return (
    <VaSelect
      {...props}
      name={name}
      label={label}
      value={value || ''}
      required={required}
      hint={hint}
      error={shouldShowError ? externalError : null}
      onVaSelect={handleChange}
      onBlur={handleBlur}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </VaSelect>
  );
};

SelectField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  forceShowError: PropTypes.bool,
  hint: PropTypes.string,
  required: PropTypes.bool,
  schema: PropTypes.object,
  value: PropTypes.string,
};
