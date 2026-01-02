import React from 'react';
import {
  titleUI,
  fileInputUI,
  fileInputSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import { supportingDocsInfo } from '../utils/helpers';
// import { fileUploadUi } from '../utils/upload';

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
      {/* <p style={{ marginBottom: 0 }}>Select a file to upload</p>
      <p style={{ color: '#757575', margin: 0 }}>
        You can upload a .jpg, .pdf, or .png file. A .jpg or .png file must be
        less than 50MB. A .pdf file must be less than 100MB.
      </p> */}
    </div>
  );
};

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Upload your supporting documents'),
    'ui:description': formData => description(formData),
    // supportingDocuments: fileUploadUi({}),
    supportingDocuments: fileInputUI({
      title: 'Select a file to upload',
      required: false, // Set to true if required
      hint:
        'You can upload a .jpg, .pdf, or .png file. A .jpg or .png file must be less than 50MB. A .pdf file must be less than 100MB.',
      accept: '.pdf,.jpg,.jpeg,.png',
      maxFileSize: 100 * 1024 * 1024, // 100MB for PDF
      skipUpload: true, // Set to false when backend is ready
      formNumber: '40-1330M', // Update with actual form number
      disallowEncryptedPdfs: true,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      // supportingDocuments: {
      //   type: 'array',
      //   items: {
      //     type: 'object',
      //     properties: {
      //       fileName: {
      //         type: 'string',
      //       },
      //       fileSize: {
      //         type: 'integer',
      //       },
      //       confirmationNumber: {
      //         type: 'string',
      //       },
      //       errorMessage: {
      //         type: 'string',
      //       },
      //       uploading: {
      //         type: 'boolean',
      //       },
      //     },
      //   },
      // },
      supportingDocuments: fileInputSchema(),
    },
  },
};
