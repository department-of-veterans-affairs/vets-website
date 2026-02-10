import React from 'react';
import {
  titleUI,
  fileInputUI,
  fileInputSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import { supportingDocsInfo } from '../utils/helpers';

const description = formData => {
  return (
    <div>
      {formData?.formContext?.onReviewPage && supportingDocsInfo(formData)}
      <p>
        You can submit your documents online now. Or, select{' '}
        <strong>Continue</strong> to submit them by mail or fax later.
      </p>
      <p>
        <strong>Note:</strong> If you want to mail or fax your documents,
        instructions will be provided after you submit this form.
      </p>
    </div>
  );
};

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Upload your supporting documents'),
    'ui:description': formData => description(formData),
    supportingDocuments: fileInputUI({
      title: 'Select a file to upload',
      required: false,
      hint:
        'You can upload a .jpg, .pdf, or .png file. All files must be less than 100MB.',
      accept: '.pdf,.jpg,.jpeg,.png',
      maxFileSize: 100 * 1024 * 1024,
      skipUpload: true, // Set to false if needed for API connection in the future
      formNumber: '40-1330M',
      disallowEncryptedPdfs: true,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      supportingDocuments: fileInputSchema(),
    },
  },
};
