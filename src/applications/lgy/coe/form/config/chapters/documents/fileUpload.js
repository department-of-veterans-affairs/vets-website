import React from 'react';
import environment from 'platform/utilities/environment';
import { validateFileField } from 'platform/forms-system/src/js/validation';

import FileField from './FileField';
import UploadRequirements from './UploadRequirements';
import { validateDocumentDescription } from '../../../validations';
import { DOCUMENT_TYPES } from '../../../../status/constants';

const DocumentUploadDescription = () => (
  <div>
    <h3 className="vads-u-font-size--h4">
      Having problems uploading your document?
    </h3>
    <p>
      You can upload your document in a .pdf, .jpg, .jpeg, or .png file format.
      You’ll first need to scan a copy of your document onto your computer or
      mobile phone. You can then upload the document from there.
    </p>
    <p>Guidelines for uploading a file:</p>
    <ul>
      <li>You can upload a .pdf, .jpg, .jpeg, or .png file.</li>
      <li>Your PDF file should be no larger than 99MB.</li>
      <li>Non-PDF files should be no larger than 50MB.</li>
    </ul>
    <p>
      A 1MB file equals about 500 pages of text. A photo or scan is usually
      about 6MB. Large files can take longer to upload with a slow internet
      connection.
    </p>
  </div>
);

export const schema = {
  type: 'object',
  properties: {
    'view:documentRequirements': {
      type: 'object',
      properties: {},
    },
    files: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        required: ['attachmentType'],
        properties: {
          name: {
            type: 'string',
          },
          size: {
            type: 'integer',
          },
          confirmationCode: {
            type: 'string',
          },
          attachmentType: {
            type: 'string',
            enum: DOCUMENT_TYPES,
            enumNames: DOCUMENT_TYPES,
          },
          attachmentDescription: {
            type: 'string',
          },
        },
      },
    },
    'view:documentUploadDescription': {
      type: 'object',
      properties: {},
    },
  },
};

export const uiSchema = {
  'view:documentRequirements': {
    'ui:title': ' ',
    'ui:description': UploadRequirements,
    'ui:options': {
      classNames: 'schemaform-block-override',
      forceDivWrapper: true,
    },
  },
  files: {
    'ui:title': ' ',
    'ui:field': FileField,
    'ui:options': {
      addAnotherLabel: 'Upload another document',
      attachmentType: {
        'ui:title': 'Document type',
      },
      attachmentDescription: {
        'ui:title': 'Document description',
      },
      buttonText: 'Upload document',
      classNames: 'schemaform-file-upload',
      createPayload: (file, formId, password) => {
        const payload = new FormData();
        payload.append('file', file);
        payload.append('form_id', formId);
        // password for encrypted PDFs
        if (password) {
          payload.append('password', password);
        }
        return payload;
      },
      fileTypes: ['pdf', 'jpg', 'jpeg', 'png'],
      fileUploadUrl: `${environment.API_URL}/v0/claim_attachments`,
      hideLabelText: true,
      keepInPageOnReview: true,
      maxPdfSize: 99 * 1024 * 1024,
      maxSize: 50 * 1024 * 1024,
      minSize: 1024,
      parseResponse: fileInfo => ({
        name: fileInfo.data.attributes.name,
        size: fileInfo.data.attributes.size,
        confirmationCode: fileInfo.data.attributes.confirmationCode,
      }),
      showFieldLabel: true,
    },
    'ui:errorMessages': {
      required: 'You must upload a file',
      minItems: 'You must upload at least one file',
    },
    'ui:validations': [validateFileField, validateDocumentDescription],
  },
  'view:documentUploadDescription': {
    'ui:title': ' ',
    'ui:description': DocumentUploadDescription,
    'ui:options': {
      forceDivWrapper: true,
    },
  },
};
