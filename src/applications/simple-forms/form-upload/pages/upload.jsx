import React from 'react';
import {
  descriptionUI,
  fileInputUI,
  fileInputSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import PropTypes from 'prop-types';
import {
  UPLOAD_FORM_DESCRIPTION,
  FILE_UPLOAD_URL,
  MAX_FILE_SIZE,
} from '../config/constants';
import { getFormContent } from '../helpers';
import { CustomAlertPage } from './helpers';

const { formNumber, title } = getFormContent();

const warningsPresent = formData => formData.uploadedFile?.warnings?.length > 0;

export const uploadPage = {
  uiSchema: {
    ...descriptionUI(UPLOAD_FORM_DESCRIPTION),
    uploadedFile: {
      ...fileInputUI({
        errorMessages: { required: `Upload a completed VA Form ${formNumber}` },
        name: 'form-upload-file-input',
        fileUploadUrl: FILE_UPLOAD_URL,
        title,
        hint:
          'You can upload a .pdf, .jpeg, or .png file. Your file should be no larger than 25MB',
        formNumber,
        required: () => true,
        // Disallow uploads greater than 25 MB
        maxFileSize: MAX_FILE_SIZE,
        updateUiSchema: formData => {
          return {
            'ui:title': warningsPresent(formData)
              ? title.replace('Upload ', '')
              : title,
          };
        },
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      uploadedFile: fileInputSchema(),
    },
    required: ['uploadedFile'],
  },
};

/** @type {CustomPageType} */
export function UploadPage(props) {
  return <CustomAlertPage {...props} />;
}

UploadPage.propTypes = {
  data: PropTypes.shape({
    uploadedFile: PropTypes.shape({
      warnings: PropTypes.arrayOf(PropTypes.string),
    }),
  }).isRequired,
};
