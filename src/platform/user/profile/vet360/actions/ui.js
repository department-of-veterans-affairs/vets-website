export const UPDATE_PROFILE_FORM_FIELD = 'UPDATE_PROFILE_FORM_FIELD';
export const OPEN_MODAL = 'OPEN_MODAL';
export const UPDATE_ADDRESS = 'UPDATE_ADDRESS';

export const openModal = modal => ({ type: OPEN_MODAL, modal });

export const closeModal = () => ({ type: OPEN_MODAL });

export const updateFormField = (
  fieldName,
  convertNextValueToCleanData,
  validateCleanData,
  value,
  property,
  skipValidation = false,
) => {
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
};

export const updateSelectedAddress = (address, selectedId) => ({
  type: UPDATE_ADDRESS,
  selectedAddress: address,
  selectedId,
});
