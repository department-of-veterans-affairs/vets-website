import React from 'react';
import {
  fileInputUI,
  fileInputSchema,
  titleUI,
} from '~/platform/forms-system/src/js/web-component-patterns';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { UPLOAD_GUIDELINES, FORM_UPLOAD_OCR_ALERT } from '../config/constants';
import { getFormContent, getPdfDownloadUrl, onCloseAlert } from '../helpers';
import { CustomAlertPage } from './helpers';

const { formNumber, title } = getFormContent();

export const uploadPage = {
  uiSchema: {
    'view:uploadGuidelines': {
      'ui:description': UPLOAD_GUIDELINES,
    },
    uploadedFile: {
      ...fileInputUI({
        errorMessages: { required: `Upload a completed VA Form ${formNumber}` },
        name: 'form-upload-file-input',
        fileUploadUrl: `${
          environment.API_URL
        }/simple_forms_api/v1/scanned_form_upload`,
        title,
        formNumber,
        required: () => true,
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
      'view:alertTooManyPages': {
        type: 'object',
        properties: {},
      },
    },
    required: ['uploadedFile'],
  },
};

export const uploadReviewPage = {
  uiSchema: {
    ...titleUI(''),
    uploadedFile: {
      ...fileInputUI({
        errorMessages: { required: `Upload a completed VA Form ${formNumber}` },
        name: 'form-upload-file-input',
        fileUploadUrl: `${
          environment.API_URL
        }/simple_forms_api/v1/scanned_form_upload`,
        title: 'Your file',
        formNumber,
        required: () => false,
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      uploadedFile: fileInputSchema,
    },
    required: ['uploadedFile'],
  },
};

/** @type {CustomPageType} */
export function UploadReviewPage(props) {
  const alert = FORM_UPLOAD_OCR_ALERT(
    formNumber,
    getPdfDownloadUrl(formNumber),
    onCloseAlert,
    props.formData?.uploadedFile?.warnings,
  );
  return <CustomAlertPage {...props} alert={alert} />;
}
