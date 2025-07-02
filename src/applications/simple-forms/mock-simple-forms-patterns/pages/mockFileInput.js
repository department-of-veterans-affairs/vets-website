import React from 'react';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  fileInputUI,
  fileInputSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    wcv3FileInput: fileInputUI({
      title: 'Web component v3 file input',
      required: false,
      fileUploadUrl: 'http://localhost:3000/upload', // https://api.test.gov',
      accept: 'image/*',
      hint: 'This is a hint',
      headerSize: '4',
      encrypted: true,
      formNumber: '31-4159',
      errorMessages: {
        additionalInput: 'Choose a document status',
      },
      additionalInputRequired: true,
      additionalInput: error => (
        <VaSelect required error={error} label="Document status">
          <option value="public">Public</option>
          <option value="private">Private</option>
        </VaSelect>
      ),
      handleAdditionalInput: e => {
        return { documentStatus: e.detail.value };
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      wcv3FileInput: fileInputSchema(),
    },
  },
};
