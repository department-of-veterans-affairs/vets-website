import React from 'react';
import fileUploadUI from 'us-forms-system/lib/js/definitions/file';
import environment from '../../../../platform/utilities/environment';

import { PtsdNameTitle } from '../content/ptsdClassification';

const FIFTY_MB = 52428800;

const documentDescription = () => (
  <div>
    <h3>Upload supporting documents</h3>
    <p>
      You can upload your document in a pdf, .jpeg, or .png file format. You‘ll
      first need to scan a copy of your document onto your computer or mobile
      phone. You can then upload the document from there. Please note that large
      files can take longer to upload with a slow Internet connection.
      Guidelines for uploading a file:
    </p>
    <ul>
      <li>File types you can upload: .pdf, .jpeg, or .png</li>
      <li>Maximum file size: 50 MB</li>
    </ul>
    <p>
      <em>
        Large files can be more difficult to upload with a slow Internet
        connection
      </em>
    </p>
  </div>
);

export const uiSchema = index => ({
  'ui:title': ({ formData }) => (
    <PtsdNameTitle formData={formData} formType="781a" />
  ),
  'ui:description': documentDescription,
  [`secondaryUploadSources${index}`]: fileUploadUI('', {
    itemDescription: 'PTSD 781a form supporting documents',
    hideLabelText: true,
    fileUploadUrl: `${environment.API_URL}/v0/upload_supporting_evidence`,
    fileTypes: [
      'pdf',
      'jpg',
      'jpeg',
      'png',
      'gif',
      'bmp',
      'tif',
      'tiff',
      'txt',
    ],
    maxSize: FIFTY_MB,
    createPayload: file => {
      const payload = new FormData();
      payload.append('disability_details_attachment[file_data]', file);

      return payload;
    },
    parseResponse: (response, file) => ({
      name: file.name,
      confirmationCode: response.data.attributes.guid,
    }),
    // this is the uiSchema passed to FileField for the attachmentId schema
    // FileField requires this name be used
    attachmentSchema: {
      'ui:title': 'Document type',
    },
    // this is the uiSchema passed to FileField for the name schema
    // FileField requires this name be used
    attachmentName: {
      'ui:title': 'Document name',
    },
  }),
});

export const schema = index => ({
  type: 'object',
  properties: {
    [`secondaryUploadSources${index}`]: {
      type: 'array',
      items: {
        type: 'object',
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
        },
      },
    },
  },
});
