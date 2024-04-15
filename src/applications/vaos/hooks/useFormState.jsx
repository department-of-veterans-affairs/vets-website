/**
 * @module hooks
 */
import { useState, useEffect, useRef } from 'react';
import { getDefaultFormState } from '@department-of-veterans-affairs/react-jsonschema-form/lib/utils';

import {
  updateSchemasAndData,
  updateItemsSchema,
} from 'platform/forms-system/src/js/state/helpers';

function setupFormData(data, schema, uiSchema) {
  const schemaWithItemsCorrected = updateItemsSchema(schema);
  return updateSchemasAndData(
    schemaWithItemsCorrected,
    uiSchema,
    getDefaultFormState(schemaWithItemsCorrected, data, {}),
  );
}

function useDependenciesHaveChanged(deps) {
  const dependenciesRef = useRef(deps);

  const haveChanged =
    deps?.length !== dependenciesRef.current?.length ||
    deps.some(
      (currentDep, index) => currentDep !== dependenciesRef.current[index],
    );

  dependenciesRef.current = deps;

  return haveChanged;
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
  const formStateRef = useRef(null);
  const depsHaveChanged = useDependenciesHaveChanged(dependencies);

  function getFormState() {
    if (!formStateRef.current || depsHaveChanged) {
      let newFormState;
      let schema = initialSchema;
      if (typeof initialSchema === 'function') {
        schema = initialSchema();
      }

      if (!schema) {
        newFormState = { schema, data: initialData };
      } else {
        newFormState = setupFormData(
          dataUpdatedRef.current ? formStateRef.current.data : initialData,
          schema,
          uiSchema,
        );
      }

      formStateRef.current = newFormState;
    }

    return formStateRef.current;
  }

  const formState = getFormState();
  const setFormData = useState(formState.data)[1];

  useEffect(() => {
    initialLoadRef.current = false;
  }, []);

  return {
    ...formState,
    uiSchema,
    setData(newData) {
      dataUpdatedRef.current = true;
      const newFormState = updateSchemasAndData(
        formStateRef.current.schema,
        uiSchema,
        newData,
      );
      formStateRef.current = newFormState;

      setFormData(formStateRef.current.data);
    },
  };
}
