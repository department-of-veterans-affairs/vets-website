import environment from 'platform/utilities/environment';
import fileUploadUI from 'platform/forms-system/src/js/definitions/file';
import { FILE_TYPES_ACCEPTED } from '../utils/constants';

const BUTTON_TEXT = 'Upload file';

const API_ENDPOINT = 'ivc_champva/v1/forms/submit_supporting_documents';
const FILE_UPLOAD_URL = `${environment.API_URL}/${API_ENDPOINT}`;

/**
 * Builds a configured file upload UI component for submitting a single supporting document.
 *
 * @param {Object} [options={}] - Configuration options.
 * @param {string} [options.label=''] - Optional label displayed for the upload field.
 * @returns {Object} A `fileUploadUI` configuration object.
 */
export const attachmentUI = ({ label = '' } = {}) => {
  const createPayload = (file, formId, password) => {
    const payload = new FormData();
    payload.append('file', file);
    payload.append('form_id', formId);
    if (password) payload.append('password', password);
    return payload;
  };

  const parseResponse = (res, file) => ({
    name: file.name,
    confirmationCode: res.data.attributes.confirmationCode,
  });

  return fileUploadUI(label, {
    fileUploadUrl: FILE_UPLOAD_URL,
    fileTypes: FILE_TYPES_ACCEPTED,
    buttonText: BUTTON_TEXT,
    hideLabelText: !label,
    createPayload,
    parseResponse,
    uswds: true,
  });
};

export const attachmentSchema = Object.freeze({
  type: 'array',
  minItems: 1,
  items: {
    type: 'object',
    properties: {
      name: { type: 'string' },
    },
  },
});
