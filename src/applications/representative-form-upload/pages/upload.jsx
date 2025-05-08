import React from 'react';
import {
  titleUI,
  fileInputUI,
  fileInputSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import PropTypes from 'prop-types';
import {
  UPLOAD_TITLE,
  UPLOAD_DESCRIPTION,
  FORM_UPLOAD_OCR_ALERT,
  FORM_UPLOAD_INSTRUCTION_ALERT,
} from '../config/constants';
import { getFormContent, getPdfDownloadUrl, onCloseAlert } from '../helpers';
import { CustomAlertPage } from './helpers';
import { getSignInUrl } from '../utilities/constants';
import manifest from '../manifest.json';
import api from '../utilities/api';

const { formNumber, title } = getFormContent();
const baseURL = `${environment.API_URL}/accredited_representative_portal/v0`;
const fileUploadUrl = `${baseURL}/representative_form_upload`;
const warningsPresent = formData => formData.uploadedFile?.warnings?.length > 0;

const fetchNewAccessToken = async () => {
  const response = await api.getUser();

  if (response.ok || response.status === 304) {
    return response;
  }

  if (
    response.status === 401 &&
    ![manifest.rootUrl, `${manifest.rootUrl}/`].includes(
      window.location.pathname,
    )
  ) {
    window.location = getSignInUrl({
      returnUrl: window.location.href,
    });
    return null;
  }

  throw response;
};

export const uploadPage = {
  uiSchema: {
    ...titleUI(UPLOAD_TITLE, UPLOAD_DESCRIPTION),
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
      uploadedFile: fileInputSchema,
    },
    required: ['uploadedFile'],
  },
};

/** @type {CustomPageType} */
export function UploadPage(props) {
  const warnings = props.data?.uploadedFile?.warnings;
  fetchNewAccessToken();
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
