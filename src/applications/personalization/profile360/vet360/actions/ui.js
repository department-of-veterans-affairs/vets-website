// import { isValidEmail, isValidPhone } from '../../../../../platform/forms/validations';
// import { MILITARY_STATES } from '../../../../letters/utils/constants';

export const UPDATE_PROFILE_FORM_FIELD = 'UPDATE_PROFILE_FORM_FIELD';
export const OPEN_MODAL = 'OPEN_MODAL';

export function openModal(modal) {
  return { type: OPEN_MODAL, modal };
}

export function updateFormField(fieldName, cleanDataForUpdate, validator, value, property, skipValidation) {
  const cleanValue = cleanDataForUpdate(value);
  const validations = skipValidation ? validator(cleanValue, property) : {};
  return {
    type: UPDATE_PROFILE_FORM_FIELD,
    field: fieldName,
    newState: {
      value: cleanValue,
      validations
    }
  };
}
