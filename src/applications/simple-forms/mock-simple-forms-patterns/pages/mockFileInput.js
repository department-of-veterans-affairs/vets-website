import React from 'react';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  fileInputUI,
  fileInputSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

/** @type {PageSchema} */
export default {
  uiSchema: {
    wcv3FileInput: fileInputUI({
      title: 'Web component v3 file input',
      required: true,
      fileUploadUrl: `${
        environment.API_URL
      }/simple_forms_api/v1/simple_forms/submit_supporting_documents`,
      accept: '.png,.pdf',
      hint: 'Upload a file that is between 1KB and 5MB',
      headerSize: '3',
      formNumber: '31-4159',
      // skipUpload: true, // mock-forms does not have a backend for upload
      maxFileSize: 1024 * 1024 * 5,
      minFileSize: 1024,
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
            <option value="public">Public</option>
            <option value="private">Private</option>
          </VaSelect>
        );
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
      wcv3FileInput: fileInputSchema(),
    },
  },
};
