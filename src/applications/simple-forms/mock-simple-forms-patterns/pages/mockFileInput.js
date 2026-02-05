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
      }/simple_forms_api/v1/scanned_form_upload`,
      accept: '.png,.pdf,.txt,.jpg,.jpeg',
      hint: 'Upload a file that is between 1KB and 100MB',
      headerSize: '3',
      formNumber: '31-4159',
      skipUpload: false,
      // uncomment to apply one max file size limit to all file types
      // maxFileSize: 1024 * 1024 * 100, // 100MB
      // uncomment to apply one min file size limit to all file types
      // minFileSize: 1024, // 1KB
      // comment out if you want the same file size limits to apply to all file types
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
        if (value === '') return {};
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
