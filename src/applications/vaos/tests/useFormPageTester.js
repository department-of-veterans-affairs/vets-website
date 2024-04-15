import { useState } from 'react';
import { getDefaultFormState } from '@department-of-veterans-affairs/react-jsonschema-form/lib/utils';
import {
  updateSchemasAndData,
  updateItemsSchema,
} from 'platform/forms-system/src/js/state/helpers';

export default function useFormPageTester(
  initialData,
  openFormPageName = 'openFormPage',
) {
  const [dataAndSchema, setDataAndSchema] = useState({
    schema: null,
    data: initialData,
  });

  function openFormPage(page, uiSchema, schema) {
    const schemaWithItemsCorrected = updateItemsSchema(schema);
    setDataAndSchema(
      updateSchemasAndData(
        schemaWithItemsCorrected,
        uiSchema,
        getDefaultFormState(schemaWithItemsCorrected, dataAndSchema.data, {}),
      ),
    );
  }

  function updateFormData(page, uiSchema, data) {
    setDataAndSchema(
      updateSchemasAndData(dataAndSchema.schema, uiSchema, data),
    );
  }

  return {
    ...dataAndSchema,
    [openFormPageName]: openFormPage,
    updateFormData,
  };
}
