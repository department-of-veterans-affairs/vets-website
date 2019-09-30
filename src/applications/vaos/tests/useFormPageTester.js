import { useState } from 'react';
import { getDefaultFormState } from '@department-of-veterans-affairs/react-jsonschema-form/lib/utils';
import {
  updateSchemaAndData,
  updateItemsSchema,
} from 'platform/forms-system/src/js/state/helpers';

export default function useFormPageTester(initialData) {
  const [dataAndSchema, setDataAndSchema] = useState({
    schema: null,
    data: initialData,
  });

  function openFormPage(page, uiSchema, schema) {
    const schemaWithItemsCorrected = updateItemsSchema(schema);
    setDataAndSchema(
      updateSchemaAndData(
        schemaWithItemsCorrected,
        uiSchema,
        getDefaultFormState(schemaWithItemsCorrected, dataAndSchema.data, {}),
      ),
    );
  }

  function updateFormData(page, uiSchema, data) {
    setDataAndSchema(updateSchemaAndData(dataAndSchema.schema, uiSchema, data));
  }

  return {
    ...dataAndSchema,
    openFormPage,
    updateFormData,
  };
}
