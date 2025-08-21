import { updateSchemasAndData } from 'platform/forms-system/src/js/state/helpers';

export const UPDATE_PROFILE_FORM_FIELD = 'UPDATE_PROFILE_FORM_FIELD';
export const OPEN_MODAL = 'OPEN_MODAL';
export const UPDATE_SELECTED_ADDRESS = 'UPDATE_SELECTED_ADDRESS';
export const COPY_ADDRESS_MODAL = 'COPY_ADDRESS_MODAL';

export const openModal = (modal, modalData = null) => ({
  type: OPEN_MODAL,
  modal,
  modalData,
});

export const closeModal = () => ({ type: OPEN_MODAL });

export const updateCopyAddressModal = status => ({
  type: COPY_ADDRESS_MODAL,
  value: status,
});

export const updateFormFieldWithSchema = (
  fieldName,
  value,
  schema = null,
  uiSchema = null,
) => {
  const {
    data,
    schema: newSchema,
    uiSchema: newUiSchema,
  } = updateSchemasAndData(schema, uiSchema, value, true);

  return {
    type: UPDATE_PROFILE_FORM_FIELD,
    field: fieldName,
    newState: {
      value: data,
      formSchema: newSchema,
      uiSchema: newUiSchema,
    },
  };
};

export const updateSelectedAddress = (address, selectedAddressId) => ({
  type: UPDATE_SELECTED_ADDRESS,
  selectedAddress: address,
  selectedAddressId,
});
