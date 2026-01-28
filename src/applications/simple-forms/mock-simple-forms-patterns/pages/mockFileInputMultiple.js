import React from 'react';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  fileInputMultipleUI,
  fileInputMultipleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

/** @type {PageSchema} */
export default {
  uiSchema: {
    wcv3FileInputMultiple: fileInputMultipleUI({
      title: 'Web component v3 file input',
      required: true,
      accept: '.png,.pdf,.txt,.jpg,.jpeg',
      hint: 'Upload a file that is between 1KB and 100MB',
      headerSize: '3',
      formNumber: '31-4159',
      // disallowEncryptedPdfs: true,
      fileUploadUrl: `${
        environment.API_URL
      }/simple_forms_api/v1/supporting_documents_upload`,
      skipUpload: false,
      // maxFileSize: 1024 * 1024 * 100, // 100MB
      // minFileSize: 1024, // 1KB
      fileSizesByFileType: {
        pdf: {
          maxFileSize: 1024 * 1024 * 50,
          minFileSize: 1024,
        },
        default: {
          maxFileSize: 1024 * 10,
          minFileSize: 1,
        },
      },
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
