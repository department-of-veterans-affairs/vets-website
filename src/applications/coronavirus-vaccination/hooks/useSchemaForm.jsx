import { useState, useCallback } from 'react';

import {
  updateSchemaAndData,
  updateUiSchema,
} from 'platform/forms-system/src/js/state/helpers';

export default function useSchemaForm(
  rawFormSchema,
  rawUiSchema,
  rawFormData = {},
) {
  const initialUiSchema = updateUiSchema(rawUiSchema, rawFormSchema);
  const {
    data: initialFormData,
    schema: initialFormSchema,
  } = updateSchemaAndData(rawFormSchema, rawUiSchema, rawFormData);

  const [formData, setFormData] = useState(initialFormData);
  const [formSchema, setFormSchema] = useState(initialFormSchema);
  const [uiSchema, setUiSchema] = useState(initialUiSchema);

  const setFormState = useCallback(
    updatedRawFormData => {
      const newUiSchema = updateUiSchema(uiSchema, updatedRawFormData);
      const { data: newFormData, schema: newFormSchema } = updateSchemaAndData(
        formSchema,
        uiSchema,
        updatedRawFormData,
        true,
      );

      setFormData(newFormData);
      setFormSchema(newFormSchema);
      setUiSchema(newUiSchema);
    },
    [formSchema, uiSchema, setFormData, setFormSchema, setUiSchema],
  );

  return [formData, formSchema, uiSchema, setFormState];
}
