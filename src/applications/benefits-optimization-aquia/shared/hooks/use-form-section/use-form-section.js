import { useCallback, useEffect, useState } from 'react';

import { useFormValidation } from '../use-form-validation';

/**
 * Custom hook for managing form sections with automatic namespacing.
 * Handles data extraction, validation, and namespacing automatically.
 * Works with VA.gov's save-in-progress system through the data/setFormData props.
 *
 * @param {Object} config - Configuration object
 * @param {string} config.sectionName - The namespace/section name (e.g., 'personalInfo', 'mailingAddress')
 * @param {import('zod').ZodSchema} config.schema - Zod validation schema for this section
 * @param {Object} config.defaultData - Default values for this section
 * @param {Object} [config.data] - Full form data passed from parent
 * @param {Function} [config.setFormData] - Parent's setFormData function
 * @param {Function} [config.dataProcessor] - Optional function to process data before setting (e.g., ensureDateStrings)
 * @param {string} [config.customNamespace] - Override the default namespace if needed
 *
 * @returns {Object} Form section utilities
 * @returns {Object} localData - Current section data
 * @returns {Function} setLocalData - Update section data
 * @returns {Function} handleFieldChange - Field change handler with automatic namespacing
 * @returns {Function} handleContinue - Continue handler with validation and namespacing
 * @returns {Object} errors - Validation errors
 * @returns {boolean} isValid - Whether the section is valid
 * @returns {Function} validate - Manual validation trigger
 *
 * @example
 * ```jsx
 * const PersonalInfoPage = ({ data, setFormData, goForward, goBack }) => {
 *   const {
 *     localData,
 *     handleFieldChange,
 *     handleContinue,
 *     errors,
 *     formSubmitted,
 *     setFormSubmitted
 *   } = useFormSection({
 *     sectionName: 'personalInfo',
 *     schema: personalInfoSchema,
 *     defaultData: {
 *       fullName: { first: '', middle: '', last: '' },
 *       dateOfBirth: '',
 *       ssn: '',
 *       vaFileNumber: '',
 *     },
 *     data,
 *     setFormData,
 *     dataProcessor: ensureDateStrings
 *   });
 *
 *   return (
 *     <div>
 *       <FullnameField
 *         value={localData.fullName}
 *         onChange={handleFieldChange}
 *         errors={errors.fullName}
 *       />
 *       <button onClick={() => handleContinue(goForward)}>Continue</button>
 *     </div>
 *   );
 * };
 * ```
 */
export const useFormSection = ({
  sectionName,
  schema,
  defaultData,
  data = {},
  setFormData,
  dataProcessor,
  customNamespace,
}) => {
  const namespace = customNamespace || sectionName;

  const { validate, validateField, errors, clearErrors } = useFormValidation(
    schema,
  );

  // Initialize local data from parent's data prop (VA's save-in-progress)
  const [localData, setLocalData] = useState(() => {
    const parentSectionData = data?.[namespace] || {};

    const initialData = {
      ...defaultData,
      ...parentSectionData,
    };

    return dataProcessor ? dataProcessor(initialData) : initialData;
  });

  const [formSubmitted, setFormSubmitted] = useState(false);

  const [hasInitialized, setHasInitialized] = useState(false);
  useEffect(
    () => {
      if (hasInitialized) {
        validate(localData);
      } else {
        setHasInitialized(true);
      }
    },
    [localData, validate, hasInitialized],
  );

  /**
   * Handle field changes with automatic namespacing
   */
  const handleFieldChange = useCallback(
    (fieldPath, value) => {
      const processedValue = Array.isArray(value) ? value : value ?? '';

      let updatedData;
      if (fieldPath.includes('.')) {
        const parts = fieldPath.split('.');
        // Prevent prototype pollution via dangerous property names
        const dangerousKeys = Object.freeze([
          '__proto__',
          'constructor',
          'prototype',
        ]);
        updatedData = { ...localData };

        let current = updatedData;
        for (let i = 0; i < parts.length - 1; i++) {
          if (dangerousKeys.includes(parts[i])) {
            // Abort assignment if dangerous key found
            return;
          }
          if (!current[parts[i]]) {
            current[parts[i]] = {};
          }
          current = current[parts[i]];
        }
        if (dangerousKeys.includes(parts[parts.length - 1])) {
          return;
        }
        current[parts[parts.length - 1]] = processedValue;
      } else {
        updatedData = { ...localData, [fieldPath]: processedValue };
      }

      setLocalData(updatedData);

      // Update parent's data through VA's setFormData prop
      if (setFormData) {
        const namespacedData = {
          ...data,
          [namespace]: updatedData,
        };
        setFormData(namespacedData);
      }

      if (Array.isArray(processedValue)) {
        validate(updatedData);
      }
    },
    [localData, data, namespace, setFormData, validate],
  );

  /**
   * Handle continue with validation and namespacing
   */
  const handleContinue = useCallback(
    goForward => {
      setFormSubmitted(true);

      const isValidForm = validate(localData);

      if (isValidForm && goForward) {
        const namespacedData = {
          ...data,
          [namespace]: localData,
        };

        goForward(namespacedData);
      }
    },
    [localData, data, namespace, validate],
  );

  return {
    localData,
    setLocalData,
    handleFieldChange,
    handleContinue,
    errors,
    validate,
    validateField,
    clearErrors,
    formSubmitted,
    setFormSubmitted,
    namespace,
  };
};
