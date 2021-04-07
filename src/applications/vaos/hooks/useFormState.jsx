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

export default function useFormState(
  initialSchema,
  uiSchema,
  initialData = {},
  dependencies = [],
) {
  const [formState, setFormState] = useState(
    setupFormData(initialData, initialSchema, uiSchema),
  );
  useEffect(() => {
    if (dependencies?.length) {
      setFormState(setupFormData(formState.data, initialSchema, uiSchema));
    }
  }, dependencies);

  function setData(newData) {
    setFormState(updateSchemaAndData(formState.schema, uiSchema, newData));
  }

  return {
    ...formState,
    setData,
  };
}
