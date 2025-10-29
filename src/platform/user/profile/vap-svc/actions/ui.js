import { updateSchemasAndData } from 'platform/forms-system/src/js/state/helpers';

export const UPDATE_PROFILE_FORM_FIELD = 'UPDATE_PROFILE_FORM_FIELD';
export const OPEN_MODAL = 'OPEN_MODAL';
export const UPDATE_SELECTED_ADDRESS = 'UPDATE_SELECTED_ADDRESS';
export const COPY_ADDRESS_MODAL = 'COPY_ADDRESS_MODAL';

/**
 * Opens a modal for editing a contact information field.
 * Used to trigger edit mode for email, phone, or address fields.
 *
 * @param {string|null} modal - Field name to edit (from FIELD_NAMES constants), or null to close modal
 * @param {Object|null} modalData - Optional additional data to pass to the modal
 * @returns {Object} Redux action
 *
 * @example
 * import { openModal } from '@@vap-svc/actions';
 * import { FIELD_NAMES } from '@@vap-svc/constants';
 *
 * dispatch(openModal(FIELD_NAMES.MOBILE_PHONE));
 */
export const openModal = (modal, modalData = null) => ({
  type: OPEN_MODAL,
  modal,
  modalData,
});

/**
 * Closes the currently open contact information edit modal.
 *
 * @returns {Object} Redux action
 */
export const closeModal = () => ({ type: OPEN_MODAL });

export const updateCopyAddressModal = status => ({
  type: COPY_ADDRESS_MODAL,
  value: status,
});

/**
 * Updates a form field value along with its JSON schema and UI schema.
 * Used to update form state when field values change during editing.
 *
 * @param {string} fieldName - Field name to update
 * @param {*} value - New field value
 * @param {Object|null} [schema=null] - JSON schema for the field
 * @param {Object|null} [uiSchema=null] - UI schema for the field
 * @returns {Object} Redux action with updated form data and schemas
 *
 * @example
 * import { updateFormFieldWithSchema } from '@@vap-svc/actions';
 *
 * dispatch(updateFormFieldWithSchema('mobilePhone', phoneValue, schema, uiSchema));
 */
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

export const OPEN_INTL_MOBILE_CONFIRM_MODAL = 'OPEN_INTL_MOBILE_CONFIRM_MODAL';
export const CLOSE_INTL_MOBILE_CONFIRM_MODAL =
  'CLOSE_INTL_MOBILE_CONFIRM_MODAL';

/**
 * Opens a confirmation modal for saving international mobile phone numbers.
 *
 * @param {number} countryCode - The international country code for the phone number
 * @param {string} phoneNumber - The phone number
 * @param {Function} confirmFn - Callback transaction function
 */
export const openIntlMobileConfirmModal = (
  countryCode,
  phoneNumber,
  confirmFn,
) => ({
  type: OPEN_INTL_MOBILE_CONFIRM_MODAL,
  countryCode,
  phoneNumber,
  confirmFn,
});

export const closeIntlMobileConfirmModal = () => ({
  type: CLOSE_INTL_MOBILE_CONFIRM_MODAL,
});
