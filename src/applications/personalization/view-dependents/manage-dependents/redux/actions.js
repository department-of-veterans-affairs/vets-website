export const FORM_DATA_UPDATED = 'MANAGE_DEPENDENTS_UPDATED';

export function updateFormData(formSchema, uiSchema, formData) {
  return {
    type: FORM_DATA_UPDATED,
    formSchema,
    uiSchema,
    formData,
  };
}
