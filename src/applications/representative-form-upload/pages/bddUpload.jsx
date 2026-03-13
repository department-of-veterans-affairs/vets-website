// eslint-disable-next-line no-unused-vars
import React from 'react';
import {
  fileInputUI,
  fileInputSchema,
  fileInputMultipleUI,
  fileInputMultipleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { getFormContent } from '../helpers';
import {
  emptyObjectSchema,
  supportingEvidenceTitleAndDescription,
} from './helpers';
import SupportingEvidenceViewField from '../components/SupportingEvidenceViewField';

const { formNumber } = getFormContent();
const baseURL = `${environment.API_URL}/accredited_representative_portal/v0`;
const shaDocumentUploadUrl = `${baseURL}/representative_form_upload`;

export const warningsPresent = formData => {
  return (
    formData.shaDocument?.warnings?.length > 0 ||
    formData.supportingDocuments?.some(doc => doc.warnings?.length > 0)
  );
};

export const bddUploadPage = {
  uiSchema: {
    'view:shaDocumentTitle': {
      'ui:title': Object.freeze(
        <h3>Upload Secretary of the Army (SHA) document</h3>,
      ),
    },
    'view:shaDocumentDescription': {
      'ui:description': Object.freeze(
        <>
          <span className="vads-u-font-weight--bold">Note:</span> BDD claims
          require upload of a Secretary of the Army (SHA) approval letter or
          equivalent documentation before they can be processed.
        </>,
      ),
    },
    shaDocument: {
      ...fileInputUI({
        errorMessages: {
          required: 'Upload a Secretary of the Army (SHA) document',
        },
        name: 'bdd-sha-document-file-input',
        fileUploadUrl: shaDocumentUploadUrl,
        title: 'SHA document',
        hint:
          'You can upload only one file no larger than 25MB.\nYour file must be .pdf format.',
        formNumber,
        required: () => true,
        maxFileSize: 26214400, // 25MB in bytes
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
        errorMessages: { required: 'Upload supporting documents' },
        hint:
          'You can upload one file at a time no larger than 100MB.\nYour file can be .pdf, .png, or .jpg.',
        formNumber,
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:shaDocumentTitle': emptyObjectSchema,
      'view:shaDocumentDescription': emptyObjectSchema,
      shaDocument: fileInputSchema(),
      'view:supportingEvidenceTitle': emptyObjectSchema,
      'view:supportingEvidenceDescription': emptyObjectSchema,
      supportingDocuments: fileInputMultipleSchema(),
    },
    required: ['shaDocument'],
  },
};
