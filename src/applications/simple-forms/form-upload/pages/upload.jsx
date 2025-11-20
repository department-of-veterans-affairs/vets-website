import React from 'react';
import {
  descriptionUI,
  fileInputUI,
  fileInputSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

import PropTypes from 'prop-types';
import {
  UPLOAD_FORM_DESCRIPTION,
  MAX_FILE_SIZE,
  UPLOAD_TITLE,
} from '../config/constants';
import { getAlert, getFormContent } from '../helpers';
import { CustomAlertPage } from './helpers';

const { formNumber, title } = getFormContent();

const warningsPresent = formData => formData.uploadedFile?.warnings?.length > 0;

export const uploadPage = {
  uiSchema: {
    ...titleUI(
      UPLOAD_TITLE,
      <div className="vads-u-magin-top--3">
        {getAlert({ name: 'uploadPage' }, false)}
      </div>,
    ),
    ...descriptionUI(UPLOAD_FORM_DESCRIPTION),
    uploadedFile: {
      ...fileInputUI({
        errorMessages: { required: `Upload a completed VA Form ${formNumber}` },
        name: 'form-upload-file-input',
        fileUploadUrl: `${
          environment.API_URL
        }/simple_forms_api/v1/scanned_form_upload`,
        title,
        hint:
          'You can upload a .pdf, .jpeg, or .png file. Your file should be no larger than 25MB',
        formNumber,
        required: () => true,
        // Disallow uploads greater than 25 MB
        maxFileSize: MAX_FILE_SIZE,
        disallowEncryptedPdfs: true,
        updateUiSchema: formData => {
          return {
            'ui:title': warningsPresent(formData)
              ? title.replace('Upload ', '')
              : title,
          };
        },
        confirmationField: ({ formData }) => {
          return {
            data: formData?.name,
            label: 'File you uploaded',
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
