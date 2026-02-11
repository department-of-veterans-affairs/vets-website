import React from 'react';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  fileInputUI,
  fileInputSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Upload a file'),
    uploadedFile: fileInputUI({
      title: 'Your document',
      required: true,
      accept: '.png,.pdf,.txt,.jpg,.jpeg',
      hint: 'Upload a file that is between 1B and 100MB',
      headerSize: '4',
      formNumber: '31-4159',
      skipUpload: true,
      maxFileSize: 1024 * 1024 * 100, // 100MB
      minFileSize: 1, // 1B
      errorMessages: {
        additionalInput: 'Choose a document status',
      },
      additionalInputRequired: true,
      additionalInput: (error, data) => {
        const { documentStatus } = data;
        return (
          <VaSelect
            required
            error={error}
            value={documentStatus}
            label="Document status"
          >
            <option value="tax">Tax form</option>
            <option value="education">Education form</option>
            <option value="service">Service form</option>
          </VaSelect>
        );
      },
      handleAdditionalInput: e => {
        const { value } = e.detail;
        if (value === '') return {};
        return { documentStatus: e.detail.value };
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      uploadedFile: fileInputSchema(),
    },
  },
};
