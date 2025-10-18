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
   * Safely sets a nested property value without prototype pollution.
   * Uses Array.reduceRight to build object immutably from inside-out,
   * avoiding dynamic property traversal that could enable prototype pollution.
   *
   * This approach satisfies CodeQL security requirements by never assigning
   * properties through a chain derived from user input.
   *
   * @param {Object} obj - The object to update
   * @param {string[]} pathParts - Array of property names forming the path (already validated)
   * @param {*} value - The value to set
   * @returns {Object} New object with the updated value
   */
  const setNestedProperty = (obj, pathParts, value) => {
    // For single-level paths, use simple spread
    if (pathParts.length === 1) {
      return { ...obj, [pathParts[0]]: value };
    }

    // Build object from innermost to outermost using reduceRight
    // This creates a new object tree without mutating or traversing the original
    const updateAtPath = pathParts.reduceRight((accum, key, index) => {
      // For the innermost level, just return the value
      if (index === pathParts.length - 1) {
        return { [key]: value };
      }

      // For intermediate levels, wrap the accumulator
      // Get reference to existing object at this path for merging
      const getExistingAtPath = (source, keys) => {
        let current = source;
        for (let i = 0; i <= index; i++) {
          if (!current || typeof current !== 'object') return null;
          current = current[keys[i]];
        }
        return current;
      };

      const existing = getExistingAtPath(obj, pathParts);
      const isPlainObject =
        existing &&
        typeof existing === 'object' &&
        !Array.isArray(existing) &&
        existing !== null;

      return {
        [key]: {
          ...(isPlainObject ? existing : {}),
          ...accum,
        },
      };
    }, {});

    // Merge with root object
    return {
      ...obj,
      ...updateAtPath,
    };
  };

  /**
   * Handle field changes with automatic namespacing
   */
  const handleFieldChange = useCallback(
    (fieldPath, value) => {
      // Prevent prototype pollution via dangerous property names
      const dangerousKeys = Object.freeze([
        '__proto__',
        'constructor',
        'prototype',
      ]);

      const processedValue = Array.isArray(value) ? value : value ?? '';

      let updatedData;
      if (fieldPath.includes('.')) {
        const parts = fieldPath.split('.');

        // Check all parts for dangerous keys before processing
        if (parts.some(part => dangerousKeys.includes(part))) {
          // Silently block dangerous field paths to prevent prototype pollution
          return;
        }

        // Use helper function to safely set nested property
        updatedData = setNestedProperty(localData, parts, processedValue);
      } else {
        // Check for dangerous keys in simple paths
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
