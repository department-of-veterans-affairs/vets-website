import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { supportingDocsInfo } from '../utils/helpers';
import { fileUploadUi } from '../utils/upload';

const description = formData => {
  return (
    <div>
      {formData?.formContext?.onReviewPage && supportingDocsInfo(formData)}
      <p>
        You can submit your documents online now. Or, select{' '}
        <strong>Continue</strong> to submit them by mail or fax later.
      </p>
      <p>
        <strong>Note:</strong> If you want to mail or fax your documents, we’ll
        provide instructions after you submit this form.
      </p>
      <p style={{ marginBottom: 0 }}>Select a file to upload</p>
      <p style={{ color: '#757575', margin: 0 }}>
        You can upload a .jpg, .pdf, or .png file. A .jpg or .png file must be
        less than 50MB. A .pdf file must be less than 100MB.
      </p>
    </div>
  );
};

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Upload your supporting documents'),
    'ui:description': formData => description(formData),
    supportingDocuments: fileUploadUi({}),
  },
  schema: {
    type: 'object',
    properties: {
      supportingDocuments: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            fileName: {
              type: 'string',
            },
            fileSize: {
              type: 'integer',
            },
            confirmationNumber: {
              type: 'string',
            },
            errorMessage: {
              type: 'string',
            },
            uploading: {
              type: 'boolean',
            },
          },
        },
      },
    },
  },
};
