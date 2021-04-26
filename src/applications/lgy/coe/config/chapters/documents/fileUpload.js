import React from 'react';
import environment from 'platform/utilities/environment';
import fileUploadUI from 'platform/forms-system/src/js/definitions/file';
import { documentUpload } from '../../schemaImports';

const FileUploadDescription = (
  <div>
    <p>
      You can upload your document in a .pdf, .jpg, .jpeg, or .png file format.
      You’ll first need to scan a copy of your document onto your computer or
      mobile phone. You can then upload the document from there.
    </p>
    <p>Guidelines for uploading a file:</p>
    <ul>
      <li>
        File types you can upload: .pdf, .jpg, .jpeg, .png, .gif, .bmp, or .txt
      </li>
    </ul>
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
  },
  files: fileUploadUI('', {
    buttonText: 'Upload a document',
    fileUploadUrl: `${environment.API_URL}/v0/claim_attachments`,
    showFieldLabel: false,
    fileTypes: ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'txt'],
  }),
};
