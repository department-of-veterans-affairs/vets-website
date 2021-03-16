export const FORM_DATA_UPDATED = 'MANAGE_DEPENDENTS_UPDATED';
export const FORM_DATA_CLEANUP = 'MANAGE_DEPENDENTS_CLEANUP';

export function updateFormData(formSchema, uiSchema, formData, stateKey) {
  return {
    type: FORM_DATA_UPDATED,
    formSchema,
    uiSchema,
    formData,
    stateKey,
  };
}

export function cleanupFormData(stateKey) {
  return {
    type: FORM_DATA_CLEANUP,
    stateKey,
  };
}
