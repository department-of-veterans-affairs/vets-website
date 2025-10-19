import { useCallback, useState } from 'react';

import { useFormValidation } from '@bio-aquia/shared/hooks/use-form-validation';

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

  // NO parent data sync after mount - causes infinite loops with radio buttons
  // Data flows: parent -> initial state (on mount), then local changes -> parent

  const [formSubmitted, setFormSubmitted] = useState(false);

  // Memoize the validate function to prevent it from changing on every render
  const memoizedValidate = useCallback(
    validationData => {
      return validate(validationData);
    },
    [validate],
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

        // Check all parts for dangerous keys before processing
        if (parts.some(part => dangerousKeys.includes(part))) {
          // Silently block dangerous field paths to prevent prototype pollution
          return;
        }

        updatedData = { ...localData };

        let current = updatedData;
        for (let i = 0; i < parts.length - 1; i++) {
          const key = parts[i];
          // Additional safety: only create plain objects
          if (
            !current[key] ||
            typeof current[key] !== 'object' ||
            Array.isArray(current[key])
          ) {
            current[key] = Object.create(null);
          }
          current = current[key];
        }

        const finalKey = parts[parts.length - 1];
        // Use Object.defineProperty for safer property assignment
        Object.defineProperty(current, finalKey, {
          value: processedValue,
          writable: true,
          enumerable: true,
          configurable: true,
        });
      } else {
        // Also check for dangerous keys in simple paths
        const dangerousKeys = ['__proto__', 'constructor', 'prototype'];
        if (dangerousKeys.includes(fieldPath)) {
          // Silently block dangerous fields to prevent prototype pollution
          return;
        }
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

      // Validate after data changes to clear errors in real-time
      // This allows errors to clear as soon as the user fixes them
      if (formSubmitted) {
        memoizedValidate(updatedData);
      }
    },
    [localData, data, namespace, setFormData, memoizedValidate, formSubmitted],
  );

  /**
   * Handle continue with validation and namespacing
   */
  const handleContinue = useCallback(
    goForward => {
      setFormSubmitted(true);

      const isValidForm = memoizedValidate(localData);

      if (isValidForm && goForward) {
        // Pass the complete form data to goForward
        const namespacedData = {
          ...data,
          [namespace]: localData,
        };
        goForward(namespacedData);
      }
    },
    [localData, data, namespace, memoizedValidate],
  );

  // Validate on field blur (called by individual fields)
  const handleFieldBlur = useCallback(
    () => {
      memoizedValidate(localData);
    },
    [localData, memoizedValidate],
  );

  return {
    localData,
    setLocalData,
    handleFieldChange,
    handleFieldBlur,
    handleContinue,
    errors,
    validate: memoizedValidate,
    validateField,
    clearErrors,
    formSubmitted,
    setFormSubmitted,
    namespace,
  };
};
