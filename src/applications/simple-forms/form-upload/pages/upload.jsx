import React from 'react';
import {
  fileInputUI,
  fileInputSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import {
  UPLOAD_GUIDELINES,
  FORM_UPLOAD_OCR_ALERT,
  FORM_UPLOAD_INSTRUCTION_ALERT,
} from '../config/constants';
import { getFormContent, getPdfDownloadUrl, onCloseAlert } from '../helpers';
import { CustomAlertPage } from './helpers';

const { formNumber, title } = getFormContent();
const fileUploadUrl = `${
  environment.API_URL
}/simple_forms_api/v1/scanned_form_upload`;
const warningsPresent = formData => formData.uploadedFile?.warnings?.length > 0;

export const uploadPage = {
  uiSchema: {
    'view:uploadGuidelines': {
      'ui:description': UPLOAD_GUIDELINES,
      'ui:options': {
        updateUiSchema: formData => {
          return {
            'ui:description': warningsPresent(formData) ? (
              <h3>Your file</h3>
            ) : (
              UPLOAD_GUIDELINES
            ),
          };
        },
      },
    },
    uploadedFile: {
      ...fileInputUI({
        errorMessages: { required: `Upload a completed VA Form ${formNumber}` },
        name: 'form-upload-file-input',
        fileUploadUrl,
        title,
        formNumber,
        required: () => true,
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
      'view:uploadGuidelines': {
        type: 'object',
        properties: {},
      },
      uploadedFile: fileInputSchema,
    },
    required: ['uploadedFile'],
  },
};

/** @type {CustomPageType} */
export function UploadPage(props) {
  const warnings = props.data?.uploadedFile?.warnings;
  const alert = warnings
    ? FORM_UPLOAD_OCR_ALERT(
        formNumber,
        getPdfDownloadUrl(formNumber),
        onCloseAlert,
        warnings,
      )
    : FORM_UPLOAD_INSTRUCTION_ALERT(onCloseAlert);
  return <CustomAlertPage {...props} alert={alert} />;
}
