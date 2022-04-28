import React from 'react';
import environment from 'platform/utilities/environment';
import fileUploadUI from 'platform/forms-system/src/js/definitions/file';
import { documentUpload } from '../../schemaImports';
import UploadRequirements from './UploadRequirements';

const MAX_SIZE = 50 * 1024 * 1024;
const MAX_PDF_SIZE = 150 * 1024 * 1024;

const DocumentUploadDescription = () => {
  return (
    <div>
      <p>
        You can upload your document in a .pdf, .jpg, .jpeg, or .png file
        format. You’ll first need to scan a copy of your document onto your
        computer or mobile phone. You can then upload the document from there.
      </p>
      <p>Guidelines for uploading a file:</p>
      <ul>
        <li>You can upload a .pdf, .jpg, .jpeg, or .png file.</li>
        <li>Your PDF file should be no larger than 150MB.</li>
        <li>Non-PDF files should be no larger than 50MB.</li>
      </ul>
      <p>
        A 1MB file equals about 500 pages of text. A photo or scan is usually
        about 6MB. Large files can take longer to upload with a slow internet
        connection.
      </p>
    </div>
  );
};

export const schema = {
  type: 'object',
  properties: {
    'view:documentRequirements': {
      type: 'object',
      properties: {},
    },
    ...documentUpload.properties,
    'view:documentUploadDescription': {
      type: 'object',
      properties: {},
    },
  },
};

export const uiSchema = {
  'view:documentRequirements': {
    'ui:field': UploadRequirements,
    'ui:options': {
      classNames: 'schemaform-block-override',
    },
  },
  files: {
    ...fileUploadUI('Your uploaded documents', {
      buttonText: 'Upload this document',
      hideLabelText: true,
      fileUploadUrl: `${environment.API_URL}/v0/claim_attachments`,
      fileTypes: ['pdf', 'jpg', 'jpeg', 'png'],
      maxSize: MAX_SIZE,
      maxPdfSize: MAX_PDF_SIZE,
    }),
  },
  'view:documentUploadDescription': {
    'ui:title': () => (
      <legend className="schemaform-block-title">
        Having problems uploading your document?
      </legend>
    ),
    'ui:description': DocumentUploadDescription,
  },
};
