/**
 * @module hooks
 */
import { useState, useEffect, useRef } from 'react';
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
 * @param {?Object|Function} params.initialSchema The initial schema for the form.
 *   You can also pass a function to this, if you need to generate the schema based on some other data
 *   (like a list of facilities). This schema is only used on the first use of this hook, or when something in
 *   the dependencies array changes (if that array is provided). If you pass null, form setup will be skipped
 * @param {Object} [params.uiSchema=null] The uiSchema for the form. This is not held in state, so any form data update
 *   or dependency change will use the most recent version passed in.
 * @param {Object} [params.initialData={}] The initial data to use for the form state. This generally just used for the data
 *   initially loaded into state, and any later changes are ignored. However if a dependency change causes the schema
 *   to be re-generated, the most recent initialData passed in will be used, unless setData has been called
 * @param {Array} [params.dependencies=[]] Array of useEffect dependencies that will force the form state to be
 *   reset using the current values for initialSchema, uiSchema, and initialData (unless setData has been called).
 * @returns {{ schema: Object, uiSchema: Object, data: Object, settData: Function }} The form state values,
 *   and a setData function to handle user form input, to be used with SchemaForm
 */
export default function useFormState({
  initialSchema,
  uiSchema = null,
  initialData = {},
  dependencies = [],
}) {
  const initialLoadRef = useRef(true);
  const dataUpdatedRef = useRef(false);
  const [formState, setFormState] = useState(() => {
    let schema = initialSchema;
    if (typeof initialSchema === 'function') {
      schema = initialSchema();
    }

    if (!schema) {
      return { schema, data: initialData };
    }

    return setupFormData(initialData, schema, uiSchema);
  });

  useEffect(() => {
    if (dependencies?.length && !initialLoadRef.current) {
      let schema = initialSchema;
      if (typeof initialSchema === 'function') {
        schema = initialSchema();
      }

      if (schema) {
        setFormState(
          setupFormData(
            dataUpdatedRef.current ? formState.data : initialData,
            schema,
            uiSchema,
          ),
        );
      }
    }
  }, dependencies);

  useEffect(() => {
    initialLoadRef.current = false;
  }, []);

  return {
    ...formState,
    uiSchema,
    setData(newData) {
      dataUpdatedRef.current = true;
      setFormState(updateSchemaAndData(formState.schema, uiSchema, newData));
    },
  };
}
