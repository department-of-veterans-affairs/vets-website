import {
  fileInputMultipleUI,
  fileInputMultipleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { standardTitle } from '../../../content/form0781';
import {
  pmrTitle,
  pmrDescription,
} from '../../../content/form0781/supportingEvidenceEnhancement/privateMedicalRecordsUpload';
import {
  FILE_TYPES,
  HINT_TEXT,
  UPLOAD_URL,
  FILE_UPLOAD_TITLE,
} from '../../../components/fileInputComponent/constants';
import {
  createPayload,
  parseResponse,
  handleAdditionalInput,
  additionalInputUpdate,
} from '../../../utils/fileInputComponent/fileInputMultiUIConfig';
import { additionalInput } from '../../../components/fileInputComponent/AdditionalUploadInput';

export const uiSchema = {
  'ui:title': standardTitle(pmrTitle),
  'ui:description': pmrDescription,
  privateMedicalRecordAttachments: {
    ...fileInputMultipleUI({
      title: FILE_UPLOAD_TITLE,
      required: true,
      skipUpload: false,
      fileUploadUrl: UPLOAD_URL,
      formNumber: '21-526EZ',
      // will work once 'main' has been merged in with latest changes for fileSizesByFileType
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
  required: ['privateMedicalRecordAttachments'],
  properties: {
    privateMedicalRecordAttachments: fileInputMultipleSchema(),
  },
};
