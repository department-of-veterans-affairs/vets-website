import React from 'react';
import environment from 'platform/utilities/environment';
import fileUploadUI from 'platform/forms-system/src/js/definitions/file';
import { documentUpload } from '../../schemaImports';

const MAX_SIZE = 50 * 1024 * 1024;
const MAX_PDF_SIZE = 150 * 1024 * 1024;

const FileUploadDescription = (
  <div>
    <p>
      You can upload your document in a .pdf, .jpg, .jpeg, .png, .gif, .bmp, or
      .txt file format. You’ll first need to scan a copy of your document onto
      your computer or mobile phone. You can then upload the document from
      there.
    </p>
    <p>Guidelines for uploading a file:</p>
    <ul>
      <li>
        File types you can upload: .pdf, .jpg, .jpeg, .png, .gif, .bmp, or .txt
      </li>
      <li>Maximum non-PDF file size: 50MB</li>
      <li>Maximum PDF file size: 150MB</li>
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
    'view:fileUploadDescription': {
      type: 'object',
      properties: {},
    },
    ...documentUpload.properties,
  },
};

export const uiSchema = {
  'view:fileUploadDescription': {
    'ui:title': 'Upload service documentation',
    'ui:description': FileUploadDescription,
    'ui:options': {
      classNames: 'schemaform-block-override',
    },
  },
  fileType: {
    'ui:title': 'What kind of document are you uploading?',
    'ui:required': formData => formData?.willUploadDocs,
  },
  files: {
    'ui:required': formData => formData?.willUploadDocs,
    ...fileUploadUI('Uploaded files', {
      buttonText: 'Upload a document',
      fileUploadUrl: `${environment.API_URL}/v0/claim_attachments`,
      fileTypes: ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'txt'],
      maxSize: MAX_SIZE,
      maxPdfSize: MAX_PDF_SIZE,
    }),
  },
};
