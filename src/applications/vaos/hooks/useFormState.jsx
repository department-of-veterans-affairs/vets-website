/**
 * @module hooks
 */
import { useState, useEffect } from 'react';
import { getDefaultFormState } from '@department-of-veterans-affairs/react-jsonschema-form/lib/utils';

import {
  updateSchemaAndData,
  updateItemsSchema,
} from 'platform/forms-system/src/js/state/helpers';

function setupFormData(data, schema, uiSchema) {
  const schemaWithItemsCorrected = updateItemsSchema(schema);
  return updateSchemaAndData(
    schemaWithItemsCorrected,
    uiSchema,
    getDefaultFormState(schemaWithItemsCorrected, data, {}),
  );
}

/**
 * Hook for managing the state for a SchemaForm page in local component state
 * instead of redux
 *
 * @export
 * @name useFormState
 * @function
 * @param {Object} params Hook parameters
 * @param {Object|Function} params.initialSchema The initial schema for the form. Can also be a function, which will
 *   only be executed on startup or when enabled or dependencies changes
 * @param {Object} params.uiSchema The uiSchema for the form
 * @param {Object} params.initialData The initial data to use for the form state. This is only used the first time the
 *   hook is called
 * @param {Array} [params.dependencies=[]] Array of useEffect dependencies that will force the form state to be reset using the current
 *   values for initialSchema and uiSchema.
 * @param {boolean} [params.enabled=true] Indicates if the form state is enabled or not. All values will be returned as null
 *   when this is false, and when it changes to true the form state will be set up using the current schema and uiSchema
 *   values
 * }
 * @returns {{ schema: Object, uiSchema: Object, data: Object }} The form state values, to be used with SchemaForm
 */
export default function useFormState({
  initialSchema,
  uiSchema = null,
  initialData = {},
  dependencies = [],
  enabled = true,
}) {
  const [formState, setFormState] = useState(() => {
    if (!enabled) {
      return null;
    }

    let schema = initialSchema;
    if (typeof initialSchema === 'function') {
      schema = initialSchema();
    }

    return setupFormData(initialData, schema, uiSchema);
  });

  useEffect(() => {
    if (dependencies?.length && enabled) {
      let schema = initialSchema;
      if (typeof initialSchema === 'function') {
        schema = initialSchema();
      }
      setFormState(setupFormData(formState.data, schema, uiSchema));
    }
  }, dependencies || []);

  useEffect(
    () => {
      if (enabled) {
        let schema = initialSchema;
        if (typeof initialSchema === 'function') {
          schema = initialSchema();
        }
        setFormState(setupFormData(initialData, schema, uiSchema));
      }
    },
    [enabled],
  );

  if (!enabled) {
    return { schema: null, uiSchema, data: null };
  }

  function setData(newData) {
    setFormState(updateSchemaAndData(formState.schema, uiSchema, newData));
  }

  return {
    ...formState,
    uiSchema,
    setData,
  };
}
