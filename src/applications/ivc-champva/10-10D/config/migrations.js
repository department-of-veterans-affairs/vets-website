/**
 * [10-10d migration version 0 -> 1]
 *
 * Flattens SSN/VA File Number object info down to a single string on items in
 * the applicants array.
 *
 * @param {{formData: object, metadata: object, formId: string}} param0 - Object containing form data/metadata
 * @param {object} param0.formData - current formData from SIP interface
 * @param {object} param0.metadata - current metadata from SIP interface
 * @param {string} param0._formId- current form ID from SIP interface, e.g. '10-10D'
 * @returns {{formData: object, metadata: object}}
 */
export const flattenApplicantSSN = ({ formData, metadata, _formId }) => {
  formData.applicants?.forEach(app => {
    const tmpApp = app; // Changes will be set directly on `formData`
    if (typeof app.applicantSSN === 'object') {
      // Flatten SSN object to a string:
      tmpApp.applicantSSN =
        app.applicantSSN?.ssn || app.applicantSSN?.vaFileNumber || '';
    }
  });
  return { formData, metadata };
};
