import {
  titleUI,
  fileInputMultipleUI,
  fileInputMultipleSchema,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import {
  UPLOAD_SUPPORTING_DOCUMENTS,
  UPLOAD_SUPPORTING_DOCUMENTS_DESCRIPTION,
  FILE_UPLOAD_URL,
  MAX_FILE_SIZE,
} from '../config/constants';
import { getFormContent } from '../helpers';

const { formNumber } = getFormContent();

export const showSupportingDocuments = {
  uiSchema: {
    showSupportingDocuments: {
      ...yesNoUI({
        required: () => true,
        labelHeaderLevel: 3,
        title: 'Do you want to upload supporting documents now?',
        hint: 'To avoid processing delays, submit your evidence now.',
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      showSupportingDocuments: yesNoSchema,
    },
  },
};

export const uploadSupportingDocuments = {
  uiSchema: {
    ...titleUI(
      UPLOAD_SUPPORTING_DOCUMENTS,
      UPLOAD_SUPPORTING_DOCUMENTS_DESCRIPTION,
    ),
    supportingDocuments: {
      ...fileInputMultipleUI({
        errorMessages: { required: 'Upload supporting documents' },
        name: 'form-upload-file-input-multiple',
        fileUploadUrl: FILE_UPLOAD_URL,
        title: 'Upload supporting documents',
        hint:
          'You can upload a .pdf, .jpeg, or .png file. Each file should be no larger than 25MB.',
        formNumber,
        required: true,
        // Disallow uploads greater than 25 MB
        maxFileSize: MAX_FILE_SIZE,
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      supportingDocuments: fileInputMultipleSchema(),
    },
  },
};
