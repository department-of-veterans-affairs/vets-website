import React from 'react';

/**
 * Shared field mapping utilities to reduce duplication across web component field mappings
 */

/**
 * Get the default value for a field, handling undefined formData
 * @param {*} formData - The form data value
 * @param {*} defaultValue - The default value to use if formData is undefined
 * @returns {*} The processed value
 */
export function getFieldValue(formData, defaultValue = '') {
  return typeof formData === 'undefined' ? defaultValue : formData;
}

/**
 * Create standard change handler that processes values and calls onChange
 * @param {Function} onChange - The onChange function from childrenProps
 * @param {Object} options - Configuration options
 * @param {boolean} options.emptyAsUndefined - Convert empty strings to undefined
 * @returns {Function} The change handler function
 */
export function createChangeHandler(onChange, options = {}) {
  const { emptyAsUndefined = true } = options;

  return (event, value) => {
    // Get value from parameter or event target
    let newVal = value !== undefined ? value : event.target.value;

    // Convert empty strings to undefined if configured to do so
    if (emptyAsUndefined && newVal === '') {
      newVal = undefined;
    }

    onChange(newVal);
  };
}

/**
 * Create standard blur handler
 * @param {Function} onBlur - The onBlur function from childrenProps
 * @param {string} id - The field ID from idSchema.$id
 * @returns {Function} The blur handler function
 */
export function createBlurHandler(onBlur, id) {
  return () => onBlur(id);
}

/**
 * Generate input type based on schema
 * @param {Object} schema - The JSON schema
 * @param {Object} uiOptions - UI options
 * @returns {string} The input type
 */
export function getInputType(schema, uiOptions) {
  if (uiOptions?.inputType) {
    return uiOptions.inputType;
  }

  return ['number', 'integer'].includes(schema.type) ? 'number' : 'text';
}

/**
 * Generate standard children content for fields with descriptions
 * @param {Object} props - Field props containing description elements
 * @returns {React.Element} The children JSX element
 */
export function generateFieldChildren({
  formDescriptionSlot,
  textDescription,
  DescriptionField,
  description,
  uiOptions,
  index,
}) {
  return (
    <>
      {formDescriptionSlot}
      {textDescription && <p>{textDescription}</p>}
      {DescriptionField && (
        <DescriptionField options={uiOptions} index={index} />
      )}
      {!textDescription && !DescriptionField && description}
    </>
  );
}

/**
 * Create a base field mapping object with common properties
 * @param {Object} props - The field props
 * @param {Object} options - Configuration options
 * @returns {Object} Base field mapping object
 */
export function createBaseFieldMapping(props, options = {}) {
  const { childrenProps } = props;
  const {
    defaultValue = '',
    emptyAsUndefined = true,
    eventName = 'onInput',
  } = options;

  return {
    value: getFieldValue(childrenProps.formData, defaultValue),
    [eventName]: createChangeHandler(childrenProps.onChange, {
      emptyAsUndefined,
    }),
    onBlur: createBlurHandler(childrenProps.onBlur, childrenProps.idSchema.$id),
  };
}
