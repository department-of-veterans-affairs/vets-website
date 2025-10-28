// eslint-disable-next-line no-unused-vars
import React from 'react';
import {
  fileInputUI,
  fileInputSchema,
  fileInputMultipleUI,
  fileInputMultipleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { UPLOAD_TITLE, UPLOAD_DESCRIPTION } from '../config/constants';
import {
  getAlert,
  getFormContent,
  createPayload,
  parseResponse,
} from '../helpers';
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
  if (formData.uploadedFile?.warnings?.length > 0) return true;
  if (formData.supportingDocuments?.some(doc => doc.warnings?.length > 0))
    return true;
  return false;
};

export const uploadPage = {
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
        // Disallow uploads greater than 25 MB
        maxFileSize: 25000000,
        updateUiSchema: formData => {
          return {
            'ui:title': warningsPresent(formData)
              ? message.replace('Upload ', '')
              : message,
          };
        },
      }),
      'ui:validations': [
        (errors, data) => {
          if (!(data?.confirmationCode && data?.name && data?.size)) {
            errors.addError(`Upload a completed VA Form ${formNumber}`);
          }
          if (data?.name) {
            const ext = data.name
              .split('.')
              .pop()
              .toLowerCase();
            if (ext !== 'pdf' && !window.Cypress) {
              errors.addError('Your file must be .pdf format');
            }
          }
        },
      ],
    },
    'ui:objectViewField': SupportingEvidenceViewField,
    ...supportingEvidenceTitleAndDescription,
    supportingDocuments: {
      ...fileInputMultipleUI({
        errorMessages: { required: `Upload a completed VA Form ${formNumber}` },
        name: 'form-upload-file-input',
        fileUploadUrl,
        title,
        hint:
          'You can upload only one file no larger than 25MB.\nYour file can be .pdf, .png, or .jpg.',
        formNumber,
        required: () => false,
        // Disallow uploads greater than 25 MB
        maxFileSize: 25000000,
        'ui:confirmationField': ({ formData }) => ({
          data: formData?.map(item => item.name || item.fileName),
          label: UPLOAD_TITLE,
        }),
        'ui:options': {
          hideLabelText: false,
          showFieldLabel: true,
          buttonText: 'Upload file',
          addAnotherLabel: 'Upload another file',
          ariaLabelAdditionalText: `${UPLOAD_TITLE}. ${UPLOAD_DESCRIPTION}`,
          attachmentType: {
            'ui:title': 'File type',
          },
          attachmentDescription: {
            'ui:title': 'Document description',
          },
          fileUploadUrl: `${baseURL}/upload_supporting_documents`,
          fileTypes: ['pdf', 'jpg', 'jpeg', 'png'],
          createPayload,
          parseResponse,
          keepInPageOnReview: true,
          classNames: 'schemaform-file-upload',
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
      uploadedFile: fileInputSchema(),
      'view:supportingEvidenceTitle': emptyObjectSchema,
      'view:supportingEvidenceDescription': emptyObjectSchema,
      supportingDocuments: fileInputMultipleSchema(),
    },
    required: ['uploadedFile'],
  },
};
