import {
  fileInputMultipleUI,
  fileInputMultipleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  evidenceChoiceUploadContent,
  evidenceChoiceTitle,
} from './evidenceChoiceUpload';
import { standardTitle } from '../../../content/form0781';
import {
  FILE_TYPES,
  HINT_TEXT,
  UPLOAD_URL,
  FILE_UPLOAD_TITLE,
} from '../../../components/supportingEvidenceUpload/constants';
import { additionalInput } from '../../../components/supportingEvidenceUpload/additionalFormInput';
import {
  createPayload,
  parseResponse,
  handleAdditionalInput,
  additionalInputUpdate,
} from '../../../utils/supportingEvidence/fileInputMultiUIConfig';

export const uiSchema = {
  'ui:title': standardTitle(evidenceChoiceTitle),
  'ui:description': evidenceChoiceUploadContent,
  evidenceChoiceFileInput: {
    ...fileInputMultipleUI({
      title: FILE_UPLOAD_TITLE,
      required: true,
      skipUpload: false,
      fileUploadUrl: UPLOAD_URL,
      formNumber: '21-526EZ',
      // Disallow uploads greater than 100 MB
      maxFileSize: 104857600, // 100MB in bytes
      minSize: 1024,
      accept: FILE_TYPES,
      hint: HINT_TEXT,
      errorMessages: {
        additionalInput: 'Choose a document type',
      },
      createPayload,
      parseResponse,
      additionalInputRequired: true,
      additionalInput,
      handleAdditionalInput,
      additionalInputUpdate,
    }),
  },
};

export const schema = {
  type: 'object',
  required: ['evidenceChoiceFileInput'],
  properties: {
    evidenceChoiceFileInput: fileInputMultipleSchema(),
  },
};
