import React from 'react';
import {
  titleUI,
  fileInputMultipleUI,
  fileInputMultipleSchema,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

import {
  UPLOAD_SUPPORTING_DOCUMENTS,
  UPLOAD_SUPPORTING_DOCUMENTS_DESCRIPTION,
  SUPPORTING_DOCUMENTS,
  getTitleByForm,
  MAX_FILE_SIZE,
} from '../config/constants';
import { getFormContent } from '../helpers';

const { formNumber } = getFormContent();

export const showSupportingDocuments = {
  uiSchema: {
    ...titleUI(getTitleByForm(formNumber), SUPPORTING_DOCUMENTS),
    showSupportingDocuments: {
      ...yesNoUI({
        required: () => true,
        title: 'Do you want to upload supporting documents now?',
        errorMessages: {
          required: 'Select yes to upload your supporting documents',
        },
        confirmationField: () => ({ data: null, label: '' }),
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
        fileUploadUrl: `${
          environment.API_URL
        }/simple_forms_api/v1/supporting_documents_upload`,
        title: 'Upload supporting documents',
        hint:
          'You can upload .pdf, .jpeg, or .png files. Your file should be no larger than 25MB.',
        formNumber,
        required: true,
        // Disallow uploads greater than 25 MB
        maxFileSize: MAX_FILE_SIZE,
        disallowEncryptedPdfs: true,
        confirmationField: ({ formData }) => {
          return {
            data: (
              <ul style={{ listStyleType: 'disc' }}>
                {formData?.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            ),
            label: 'Files you uploaded',
          };
        },
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
