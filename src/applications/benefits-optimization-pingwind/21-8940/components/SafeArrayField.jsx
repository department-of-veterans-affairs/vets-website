import React, { useCallback, useEffect, useMemo } from 'react';
import ArrayField from 'platform/forms-system/src/js/fields/ArrayField';

// Wraps the platform ArrayField to ensure undefined formData defaults to an empty array.
// Also ensures nested arrays within items are initialized properly and surfaces useful diagnostics.
const SafeArrayField = props => {
  const {
    schema,
    formData,
    formContext,
    idSchema,
    uiSchema,
    onChange,
    arrayFieldComponent: ArrayFieldComponent = ArrayField,
    ...rest
  } = props;

  const normalizedSchema = useMemo(
    () => {
      if (!schema || !schema.items) {
        return schema;
      }

      // If items is already an array (tuple-style), return as-is
      if (Array.isArray(schema.items)) {
        return schema;
      }

      // For backwards compatibility: Convert single item schema to tuple format
      // This ensures getItemSchema works correctly with platform's ArrayField
      return {
        ...schema,
        items: [schema.items],
        additionalItems:
          schema.additionalItems !== undefined
            ? schema.additionalItems
            : schema.items,
      };
    },
    [schema],
  );

  const getItemSchemaForIndex = useCallback(
    index => {
      if (!normalizedSchema) {
        return undefined;
      }
      // Handle tuple-style schema (items is an array)
      if (Array.isArray(normalizedSchema.items)) {
        if (index < normalizedSchema.items.length) {
          return normalizedSchema.items[index];
        }
        return (
          normalizedSchema.additionalItems ||
          normalizedSchema.items[normalizedSchema.items.length - 1]
        );
      }
      // Handle regular schema (items is an object) - shouldn't happen after normalization
      return normalizedSchema.items;
    },
    [normalizedSchema],
  );

  const { sanitizedData, corrections } = useMemo(
    () => {
      const issues = [];

      if (!Array.isArray(formData)) {
        if (formData !== undefined && formData !== null) {
          issues.push({ type: 'nonArrayRoot', received: formData });
        }
        return { sanitizedData: [], corrections: issues };
      }

      let arrayChanged = false;

      const sanitizedItems = formData.map((item, index) => {
        const schemaForIndex = getItemSchemaForIndex(index);
        const expectsObject =
          schemaForIndex?.type === 'object' || !!schemaForIndex?.properties;

        if (!expectsObject) {
          return item;
        }

        if (!item || Array.isArray(item) || typeof item !== 'object') {
          issues.push({ type: 'nonObjectItem', item, index, schemaForIndex });
          arrayChanged = true;
          return {};
        }

        let itemChanged = false;
        const updatedItem = { ...item };
        Object.entries(schemaForIndex?.properties || {}).forEach(
          ([key, propSchema]) => {
            if (
              propSchema?.type === 'array' &&
              updatedItem[key] === undefined
            ) {
              updatedItem[key] = [];
              itemChanged = true;
            }
          },
        );

        if (itemChanged) {
          arrayChanged = true;
          return updatedItem;
        }

        return item;
      });

      if (!arrayChanged) {
        for (let index = 0; index < sanitizedItems.length; index += 1) {
          if (sanitizedItems[index] !== formData[index]) {
            arrayChanged = true;
            break;
          }
        }
      }

      const normalizedData =
        issues.length || arrayChanged ? sanitizedItems : formData;
      return { sanitizedData: normalizedData, corrections: issues };
    },
    [formData, getItemSchemaForIndex],
  );

  useEffect(
    () => {
      if (!corrections.length) {
        return;
      }

      if (onChange) {
        onChange(sanitizedData);
      }
    },
    [corrections, onChange, sanitizedData],
  );

  // Safety check: ensure normalizedSchema is valid before rendering
  const safeSchema = normalizedSchema ||
    schema || {
      type: 'array',
      items: [{}],
    };

  return (
    <ArrayFieldComponent
      {...rest}
      idSchema={idSchema}
      uiSchema={uiSchema}
      schema={safeSchema}
      formData={sanitizedData}
      formContext={formContext}
      onChange={onChange}
    />
  );
};

export default SafeArrayField;
