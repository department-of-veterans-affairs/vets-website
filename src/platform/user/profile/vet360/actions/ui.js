export const UPDATE_PROFILE_FORM_FIELD = 'UPDATE_PROFILE_FORM_FIELD';
export const OPEN_MODAL = 'OPEN_MODAL';

export function openModal(modal) {
  return { type: OPEN_MODAL, modal };
}

export function updateFormField(
  fieldName,
  convertNextValueToCleanData,
  validateCleanData,
  value,
  property,
  skipValidation = false,
) {
  const cleanValue = convertNextValueToCleanData(value);
  const validations = skipValidation
    ? {}
    : validateCleanData(cleanValue, property);
  return {
    type: UPDATE_PROFILE_FORM_FIELD,
    field: fieldName,
    newState: {
      value: cleanValue,
      validations,
    },
  };
}
