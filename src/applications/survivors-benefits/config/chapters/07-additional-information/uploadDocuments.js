import React from 'react';
import {
  titleUI,
  fileInputMultipleUI,
  fileInputMultipleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import environment from 'platform/utilities/environment';
import DualFileUploadField from '../../../components/DualFileUploadField';

const UploadMessage = (
  <p>
    <strong>Note:</strong> You can submit your supporting documents and
    additional evidence after submitting your application. You’ll need to submit
    them by mail or upload them using the Claim Status Tool.
  </p>
);

const filesUi = fileInputMultipleUI({
  title: 'Select a file to upload',
  hint:
    'You can upload a .pdf, .jpg, .jpeg, .bmp, or .txt file. Your file should be no larger than 50 MB (non-PDF) or 99 MB (PDF only).',
  required: false,
  fileUploadUrl: `${environment.API_URL}/v0/claim_attachments`,
  maxFileSize: 103809024, // 99 MB for PDFs
  accept: '.pdf,.jpg,.jpeg,.bmp,.txt',
  formNumber: '21P-534EZ',
});

export default {
  uiSchema: {
    ...titleUI(
      'Submit your supporting documents',
      'You can submit your supporting documents and additional evidence with your application.',
    ),
    files: {
      ...filesUi,
      'ui:webComponentField': DualFileUploadField,
      'ui:options': {
        ...filesUi['ui:options'],
      },
    },
    'view:uploadMessage': {
      'ui:description': UploadMessage,
    },
  },
  schema: {
    type: 'object',
    properties: {
      files: fileInputMultipleSchema(),
      'view:uploadMessage': {
        type: 'object',
        properties: {},
      },
    },
  },
};
