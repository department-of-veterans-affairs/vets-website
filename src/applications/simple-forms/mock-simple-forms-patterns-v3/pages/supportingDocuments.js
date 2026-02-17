import React from 'react';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  fileInputMultipleUI,
  fileInputMultipleSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Supporting documents'),
    supportingDocuments: fileInputMultipleUI({
      title: 'Supporting documents',
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
      additionalInput: () => {
        return (
          <VaSelect required label="Document status">
            <option value="public">Public</option>
            <option value="private">Private</option>
          </VaSelect>
        );
      },
      additionalInputUpdate: (instance, error, data) => {
        instance.setAttribute('error', error);
        if (data) {
          instance.setAttribute('value', data.documentStatus);
        }
      },
      handleAdditionalInput: e => {
        const { value } = e.detail;
        if (value === '') return null;
        return { documentStatus: e.detail.value };
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      supportingDocuments: fileInputMultipleSchema(),
    },
  },
};
