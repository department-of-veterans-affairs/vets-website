// eslint-disable-next-line no-unused-vars
import React from 'react';
import {
  fileInputUI,
  fileInputSchema,
  fileInputMultipleUI,
  fileInputMultipleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { getAlert, getFormContent } from '../helpers';
import {
  emptyObjectSchema,
  uploadTitleAndDescription,
  supportingEvidenceTitleAndDescription,
} from './helpers';
import SupportingEvidenceViewField from '../components/SupportingEvidenceViewField';

const { formNumber, title, message } = getFormContent();
const baseURL = `${environment.API_URL}/accredited_representative_portal/v0`;
const fileUploadUrl = `${baseURL}/representative_form_upload`;

export const warningsPresent = formData => {
  return (
    formData.uploadedFile?.warnings?.length > 0 ||
    formData.supportingDocuments?.some(doc => doc.warnings?.length > 0)
  );
};

export const unifiedUploadPage = {
  uiSchema: {
    'ui:description': props => {
      const modifiedProps = { ...props };
      modifiedProps.data = modifiedProps.formData;
      modifiedProps.name = 'uploadPage';
      return getAlert(modifiedProps);
    },
    ...uploadTitleAndDescription,
    uploadedFile: {
      ...fileInputUI({
        errorMessages: { required: `Upload a completed VA Form ${formNumber}` },
        name: 'form-upload-file-input',
        fileUploadUrl,
        title,
        hint:
          'You can upload only one file no larger than 25MB.\nYour file must be .pdf format.',
        formNumber,
        required: () => true,
        maxFileSize: 26214400, // 25MB in bytes
        updateUiSchema: formData => {
          return {
            'ui:title': warningsPresent(formData)
              ? message.replace('Upload ', '')
              : message,
          };
        },
      }),
    },
    'ui:objectViewField': SupportingEvidenceViewField,
    ...supportingEvidenceTitleAndDescription,
    supportingDocuments: {
      ...fileInputMultipleUI({
        title: 'Upload supporting evidence',
        required: false,
        skipUpload: false,
        fileUploadUrl: `${baseURL}/upload_supporting_documents`,
        maxFileSize: 104857600, // 100MB in bytes
        accept: '.pdf,jpg,.jpeg,.png',
        errorMessages: { required: `Upload a completed VA Form ${formNumber}` },
        hint:
          'You can upload one file at a time no larger than 100MB.\nYour file can be .pdf, .png, or .jpg.',
        formNumber,
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:uploadTitle': emptyObjectSchema,
      'view:uploadFormNumberDescription': emptyObjectSchema,
      'view:uploadDescription': emptyObjectSchema,
      uploadedFile: fileInputSchema(),
      'view:supportingEvidenceTitle': emptyObjectSchema,
      'view:supportingEvidenceDescription': emptyObjectSchema,
      supportingDocuments: fileInputMultipleSchema(),
    },
    required: ['uploadedFile'],
  },
};
