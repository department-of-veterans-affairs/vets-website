import React from 'react';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  fileInputMultipleUI,
  fileInputMultipleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import environment from 'platform/utilities/environment';

import { evidenceChoiceUploadContent } from './form0781/supportingEvidenceEnhancement/evidenceChoiceUploadPage';
import { standardTitle } from '../content/form0781';
import UploadFiles from '../components/supportingEvidenceUpload/uploadFiles';
import {
  FILE_TYPES,
  HINT_TEXT,
  LABEL_TEXT,
  ATTACHMENTS_TYPE,
  ADDITIONAL_ATTACHMENT_LABEL,
} from '../components/supportingEvidenceUpload/constants';

const fileUploadUrl = `${environment.API_URL}/v0/upload_supporting_evidence`;

/**
 * Custom payload for 526EZ backend - uses supporting_evidence_attachment format
 * @param {File} file - The file to upload
 * @param {string} _formId - Form ID (unused, backend uses different format)
 * @param {string} password - Password for encrypted PDFs
 * @returns {FormData} Formatted payload for backend
 */
const createPayload = (file, _formId, password) => {
  const payload = new FormData();
  payload.append('supporting_evidence_attachment[file_data]', file);
  if (password) {
    payload.append('supporting_evidence_attachment[password]', password);
  }
  return payload;
};

/**
 * Parse response from 526EZ upload endpoint
 * @param {Object} response - API response
 * @param {File} file - Original file
 * @returns {Object} Parsed file data with all fields needed for save-in-progress
 */
const parseResponse = (response, file) => ({
  name: file.name,
  size: file.size,
  type: file.type,
  confirmationCode: response.data.attributes.guid,
  file,
});

// Shared view config for both legacy and enhanced versions
const evidenceChoiceUploadView = {
  'ui:title': standardTitle('Upload supporting documents and additional forms'),
  'ui:description': evidenceChoiceUploadContent,
};

const evidenceChoiceUploadSchema = {
  type: 'object',
  properties: {},
};

/**
 * Legacy implementation (feature toggle OFF)
 * Uses custom UploadFiles component with existing backend payload format
 */
export const legacyUiSchema = {
  'view:evidenceChoiceUpload': evidenceChoiceUploadView,
  uploadedFiles: {
    'ui:title': ' ',
    'ui:field': UploadFiles,
    'ui:required': () => true,
    'ui:errorMessages': {
      required: 'Please upload at least one supporting document',
    },
  },
};

export const legacySchema = {
  type: 'object',
  required: ['uploadedFiles'],
  properties: {
    'view:evidenceChoiceUpload': evidenceChoiceUploadSchema,
    uploadedFiles: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        properties: {},
      },
    },
  },
};

/**
 * Enhanced implementation (feature toggle ON)
 * Uses platform fileInputMultipleUI with custom createPayload/parseResponse
 * to match the 526EZ backend's expected payload format
 */
export const enhancedUiSchema = {
  'view:evidenceChoiceUpload': evidenceChoiceUploadView,
  uploadedFiles: fileInputMultipleUI({
    title: LABEL_TEXT,
    hint: HINT_TEXT,
    required: true,
    fileUploadUrl,
    createPayload,
    parseResponse,
    accept: FILE_TYPES.map(type => `.${type}`).join(','),
    formNumber: '21-526EZ',
    maxFileSize: 99 * 1024 * 1024, // 99 MB for PDFs
    errorMessages: {
      required: 'Please upload at least one supporting document',
      additionalInput: 'Please provide a document type',
    },
    additionalInputRequired: true,
    additionalInput: () => {
      return (
        <VaSelect required label={ADDITIONAL_ATTACHMENT_LABEL}>
          {ATTACHMENTS_TYPE.map(attachmentType => (
            <option key={attachmentType.value} value={attachmentType.value}>
              {attachmentType.label}
            </option>
          ))}
        </VaSelect>
      );
    },
    additionalInputUpdate: (instance, error, data) => {
      instance.setAttribute('error', error);
      if (data) {
        instance.setAttribute('value', data.docType);
      }
    },
    handleAdditionalInput: e => {
      const { value } = e.detail;
      if (value === '') return null;
      return { docType: e.detail.value };
    },
  }),
};

export const enhancedSchema = {
  type: 'object',
  required: ['uploadedFiles'],
  properties: {
    'view:evidenceChoiceUpload': evidenceChoiceUploadSchema,
    uploadedFiles: fileInputMultipleSchema(),
  },
};

/**
 * Default exports for backwards compatibility
 * @deprecated Will be removed once feature toggle is fully rolled out
 */
export const uiSchema = legacyUiSchema;
export const schema = legacySchema;
