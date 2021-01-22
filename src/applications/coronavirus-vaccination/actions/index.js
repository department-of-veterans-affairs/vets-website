export const FORM_DATA_UPDATED = 'coronavirusVaccination/FORM_DATA_UPDATED';

export function updateFormData(formSchema, uiSchema, formData) {
  return {
    type: FORM_DATA_UPDATED,
    formSchema,
    uiSchema,
    formData,
  };
}
