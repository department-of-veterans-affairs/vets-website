import React from 'react';
import environment from 'platform/utilities/environment';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  fileInputMultipleUI,
  fileInputMultipleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    veteranSupportingDocuments: fileInputMultipleUI({
      title: 'Supporting documents',
      required: true,
      hint: 'Upload a file that is between 1KB and 5MB',
      headerSize: '3',
      formNumber: '21P-601',
      disallowEncryptedPdfs: true,
      fileUploadUrl: `${
        environment.API_URL
      }/simple_forms_api/v1/simple_forms/submit_supporting_documents`,
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
      veteranSupportingDocuments: fileInputMultipleSchema(),
    },
  },
};
