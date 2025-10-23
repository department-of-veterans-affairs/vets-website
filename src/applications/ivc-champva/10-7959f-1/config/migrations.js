/**
 * [10-7959f-1 migration version 0 -> 1]
 *
 * Converts phone number from phoneUI into format expected by internationalPhoneUI.
 *
 * @param {{formData: object, metadata: object, formId: string}} param0 - Object containing form data/metadata
 * @param {object} param0.formData - current formData from SIP interface
 * @param {object} param0.metadata - current metadata from SIP interface
 * @param {string} param0._formId- current form ID from SIP interface, e.g. '10-7959F-1'
 * @returns {{formData: object, metadata: object}}
 */
export const expandPhoneNumberToInternational = ({
  formData,
  metadata,
  _formId,
}) => {
  const tmpFormData = formData; // changes will apply directly to formData
  if (typeof tmpFormData?.veteranPhoneNumber === 'string') {
    tmpFormData.veteranPhoneNumber = {
      callingCode: '',
      countryCode: '',
      contact: tmpFormData.veteranPhoneNumber,
    };
  }
  return { formData, metadata };
};
