export const FORM_DATA_UPDATED = 'coronavirusVaccination/FORM_DATA_UPDATED';

// Trigger changed app build
export function updateFormData(formSchema, uiSchema, formData) {
  return {
    type: FORM_DATA_UPDATED,
    formSchema,
    uiSchema,
    formData,
  };
}
