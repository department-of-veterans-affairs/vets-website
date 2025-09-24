import React from 'react';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  fileInputMultipleUI,
  fileInputMultipleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    wcv3FileInputMultiple: fileInputMultipleUI({
      title: 'Web component v3 file input',
      required: true,
      hint: 'Upload a file that is between 1KB and 5MB',
      headerSize: '3',
      formNumber: '31-4159',
      // disallowEncryptedPdfs: true,
      skipUpload: true, // mock-forms does not have a backend for upload
      maxFileSize: 1024 * 1024 * 5,
      minFileSize: 1,
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
      wcv3FileInputMultiple: fileInputMultipleSchema(),
    },
  },
};
