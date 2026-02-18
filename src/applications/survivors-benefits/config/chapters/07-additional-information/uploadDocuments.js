import React from 'react';
import {
  titleUI,
  fileInputMultipleUI,
  fileInputMultipleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import environment from 'platform/utilities/environment';

const UploadMessage = (
  <p>
    <strong>Note:</strong> You can submit your supporting documents and
    additional evidence after submitting your application. You’ll need to submit
    them by mail or upload them using the Claim Status Tool.
  </p>
);

export default {
  uiSchema: {
    ...titleUI(
      'Submit your supporting documents',
      'You can submit your supporting documents and additional evidence with your application.',
    ),
    files: fileInputMultipleUI({
      title: 'Select a file to upload',
      hint:
        'You can upload a .pdf, .jpg, or .jpeg file. Your file should be no larger than 50 MB (non-PDF) or 99 MB (PDF only).',
      required: false,
      fileUploadUrl: `${environment.API_URL}/v0/claim_attachments`,
      maxFileSize: 103809024, // 99 MB for PDFs
      accept: '.pdf,.jpg,.jpeg',
      formNumber: '21P-534EZ',
    }),
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
