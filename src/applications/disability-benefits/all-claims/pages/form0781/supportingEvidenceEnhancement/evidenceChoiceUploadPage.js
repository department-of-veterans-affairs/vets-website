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
      fileSizesByFileType: {
        pdf: {
          maxFileSize: 1024 * 1024 * 100,
          minFileSize: 1024,
        },
        default: {
          maxFileSize: 1024 * 1024 * 50,
          minFileSize: 1,
        },
      },
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
