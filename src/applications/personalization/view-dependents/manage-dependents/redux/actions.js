export const FORM_DATA_UPDATED = 'MANAGE_DEPENDENTS_UPDATED';
export const FORM_DATA_CLEANUP = 'MANAGE_DEPENDENTS_CLEANUP';

export function updateFormData(formSchema, uiSchema, formData) {
  return {
    type: FORM_DATA_UPDATED,
    formSchema,
    uiSchema,
    formData,
  };
}

export function cleanupFormData() {
  return {
    type: FORM_DATA_CLEANUP,
  };
}
