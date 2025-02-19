import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import FileUpload from '../components/FileUpload';
import { supportingDocsInfo } from '../utils/helpers';

const description = formData => {
  return (
    <div>
      {formData?.formContext?.onReviewPage && supportingDocsInfo(formData)}
      <p>
        You can submit your documents online now. Or, select Continue to submit
        them by mail or fax later.
      </p>
      <p>
        <strong>Note:</strong> If you want to mail or fax your documents, we’ll
        provide instructions after you submit this form.
      </p>
    </div>
  );
};

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Upload your supporting documents'),
    'ui:description': formData => description(formData),
    supportingDocuments: {
      'ui:title': 'Upload documents',
      'ui:field': FileUpload,
      'ui:options': {
        keepInPageOnReview: true,
      },
    },
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
