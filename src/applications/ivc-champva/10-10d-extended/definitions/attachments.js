import environment from 'platform/utilities/environment';
import fileUploadUI from 'platform/forms-system/src/js/definitions/file';
import { FILE_TYPES_ACCEPTED } from '../utils/constants';
import content from '../locales/en/content.json';

const BUTTON_TEXT = content['attachments--button-text'];
const HINT_TEXT = content['attachments--hint-text'];

const API_ENDPOINT = 'ivc_champva/v1/forms/submit_supporting_documents';
const FILE_UPLOAD_URL = `${environment.API_URL}/${API_ENDPOINT}`;

/**
 * Builds a configured file upload UI component for submitting a single supporting document.
 *
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
  });

  return fileUploadUI(label, {
    fileUploadUrl: FILE_UPLOAD_URL,
    fileTypes: FILE_TYPES_ACCEPTED,
    buttonText: BUTTON_TEXT,
    hideLabelText: !label,
    'ui:hint': HINT_TEXT,
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

export const attachmentWithMetadataSchema = ({
  enumNames = [],
  minItems = 1,
} = {}) => {
  const options = Array.isArray(enumNames) ? enumNames : [];
  const normalized = options.map(opt => opt.trim()).filter(Boolean);

  // de-duplicate while preserving first-seen order
  const enumValues = [...new Set(normalized)];

  // coerce minItems to a safe non-negative integer (default 1)
  const safeMin =
    Number.isFinite(minItems) && minItems >= 0 ? Math.floor(minItems) : 1;

  return Object.freeze({
    type: 'array',
    minItems: safeMin,
    items: {
      type: 'object',
      required: ['attachmentId', 'name'],
      properties: {
        name: { type: 'string' },
        attachmentId: {
          type: 'string',
          enum: enumValues,
          enumNames: enumValues,
        },
      },
    },
  });
};

export const singleAttachmentSchema = Object.freeze({
  type: 'array',
  minItems: 1,
  maxItems: 1,
  items: {
    type: 'object',
    properties: {
      name: { type: 'string' },
    },
  },
});
