/**
 * Creates the payload for file upload with supporting evidence attachment
 * @param {File} file - The file to upload
 * @param {string} _formId - The form ID (unused)
 * @param {string} password - Optional password for encrypted files
 * @returns {FormData} The formatted payload for upload
 */
export const createPayload = (file, _formId, password) => {
  const payload = new FormData();
  payload.append('supporting_evidence_attachment[file_data]', file);
  if (password) {
    payload.append('supporting_evidence_attachment[password]', password);
  }
  return payload;
};

/**
 * Parses the response from file upload API
 * VaFileInputMultipleField expects `parseResponse` to include the original
 * File object under `file` so it can derive name/size/type.
 * @param {Object} response - The API response object
 * @param {File} file - The original file object
 * @returns {Object} Parsed response with name, confirmationCode and file
 */
export const parseResponse = (response, file) => {
  return {
    name: file?.name,
    confirmationCode: response?.data?.attributes?.guid,
    file,
  };
};

/**
 * Updates the additional input instance with error and data
 * @param {HTMLElement} instance - The input element instance
 * @param {string} error - Error message to display
 * @param {Object} data - Data object containing docType
 */
export const additionalInputUpdate = (instance, error, data) => {
  instance.setAttribute('error', error);
  if (data) {
    instance.setAttribute('value', data.docType);
  }
};

/**
 * Handles additional input change event
 * @param {CustomEvent} e - The change event
 * @returns {Object|null} Object with docType or null if empty
 */
export const handleAdditionalInput = e => {
  const { value } = e.detail;
  if (value === '') return null;
  return { docType: e.detail.value };
};
