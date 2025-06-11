import React from 'react';
import {
  fileInputUI,
  fileInputSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import PropTypes from 'prop-types';
import {
  FORM_UPLOAD_OCR_ALERT,
  FORM_UPLOAD_INSTRUCTION_ALERT,
} from '../config/constants';
import { getFormContent, getPdfDownloadUrl, onCloseAlert } from '../helpers';
import {
  CustomAlertPage,
  emptyObjectSchema,
  uploadTitleAndDescription,
} from './helpers';

const { formNumber, title } = getFormContent();
const baseURL = `${environment.API_URL}/accredited_representative_portal/v0`;
const fileUploadUrl = `${baseURL}/representative_form_upload`;
const warningsPresent = formData => formData.uploadedFile?.warnings?.length > 0;

export const uploadPage = {
  uiSchema: {
    ...uploadTitleAndDescription,
    uploadedFile: {
      ...fileInputUI({
        errorMessages: { required: `Upload a completed VA Form ${formNumber}` },
        name: 'form-upload-file-input',
        fileUploadUrl,
        title,
        hint:
          'You can upload a .pdf, .jpeg, or .png file. Your file should be no larger than 25MB',
        formNumber,
        required: () => true,
        // Disallow uploads greater than 25 MB
        maxFileSize: 25000000,
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
      'view:uploadTitle': emptyObjectSchema,
      'view:uploadFormNumberDescription': emptyObjectSchema,
      'view:uploadDescription': emptyObjectSchema,
      uploadedFile: fileInputSchema,
    },
    required: ['uploadedFile'],
  },
};

/** @type {CustomPageType} */
export function UploadPage(props) {
  const warnings = props.data?.uploadedFile?.warnings;
  const alert =
    warnings?.length > 0
      ? FORM_UPLOAD_OCR_ALERT(
          formNumber,
          getPdfDownloadUrl(formNumber),
          onCloseAlert,
          warnings,
        )
      : FORM_UPLOAD_INSTRUCTION_ALERT(onCloseAlert);
  return <CustomAlertPage {...props} alert={alert} />;
}

UploadPage.propTypes = {
  data: PropTypes.shape({
    uploadedFile: PropTypes.shape({
      warnings: PropTypes.arrayOf(PropTypes.string),
    }),
  }).isRequired,
};
