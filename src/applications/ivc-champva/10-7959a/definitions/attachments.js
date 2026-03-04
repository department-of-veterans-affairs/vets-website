import fileUploadUI from 'platform/forms-system/src/js/definitions/file';
import { descriptionUI } from 'platform/forms-system/src/js/web-component-patterns';
import environment from 'platform/utilities/environment';
import LlmResponseAlert from '../components/FormAlerts/LlmResponseAlert';
import LlmUploadAlert from '../components/FormAlerts/LlmUploadAlert';
import content from '../locales/en/content.json';
import { FILE_TYPES_ACCEPTED } from '../utils/constants';

const BUTTON_TEXT = content['attachments--button-text'];

const API_ENDPOINT = 'ivc_champva/v1/forms/submit_supporting_documents';
const FILE_UPLOAD_URL = `${environment.API_URL}/${API_ENDPOINT}`;

/**
 * Builds a configured file upload UI component for submitting a single supporting document.
 * @param {Object} [options={}] - Configuration options.
 * @param {string} [options.label=''] - Optional label displayed for the upload field.
 * @param {string} [options.attachmentId=''] - Optional attachment identifier sent with the upload payload.
 * @returns {Object} A `fileUploadUI` configuration object.
 */
export const attachmentUI = ({ label = '', attachmentId = '' } = {}) => {
  const createPayload = (file, formId, password) => {
    const payload = new FormData();
    payload.append('file', file);
    payload.append('form_id', formId);
    if (attachmentId) payload.append('attachment_id', attachmentId);
    if (password) payload.append('password', password);
    return payload;
  };

  const parseResponse = (res, file) => ({
    name: file.name,
    confirmationCode: res.data.attributes.confirmationCode,
    attachmentId,
    ...(res.llmResponse ? { llmResponse: res.llmResponse } : {}),
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
  items: {
    type: 'object',
    properties: {
      name: { type: 'string' },
    },
  },
});

export const llmResponseAlertUI = Object.freeze({
  'view:llmResponseAlert': descriptionUI(LlmResponseAlert),
});

export const llmResponseAlertSchema = Object.freeze({
  'view:llmResponseAlert': { type: 'object', properties: {} },
});

export const llmUploadAlertUI = Object.freeze({
  'view:llmUploadAlert': descriptionUI(LlmUploadAlert),
});

export const llmUploadAlertSchema = Object.freeze({
  'view:llmUploadAlert': { type: 'object', properties: {} },
});
