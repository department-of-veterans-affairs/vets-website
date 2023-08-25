import React from 'react';

import environment from 'platform/utilities/environment';

import { FileField } from 'platform/forms-system/src/js/fields/FileField';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': <h3>Military/Discharge Documents</h3>,
    'ui:description': (
      <>
        <p>
          To receive a Presidential Memorial Certificate, specific active duty
          service requirements must be met. Military discharge documents aren’t
          required, but they are preferred since they help speed up the
          application review.
        </p>
        <h4>Enlisted Service Members</h4>
        <ul>
          <li>
            For those who served after September 7, 1980: A minimum of 24 months
            of consecutive active service is required.
          </li>
          <li>
            For those who served before September 7, 1980: At least 1 day of
            active service is required.
          </li>
        </ul>
        <h4>Enlisted Officers</h4>
        <ul>
          <li>
            For those who served after October 16, 1981: A minimum of 24 months
            of consecutive active service is necessary.
          </li>
          <li>
            For those who served before October 16, 1981: At least 1 day of
            active service is required.
          </li>
        </ul>
        <p>
          <strong>Note</strong>: Active duty for training purposes does not
          count towards the active duty service requirement.
        </p>
        <p>
          The preferred discharge document to establish eligibility for the
          certificate is Form DD214.
        </p>
      </>
    ),
    veteranSupportingDocuments: {
      'ui:title': 'Upload files',
      'ui:field': FileField,
      'ui:options': {
        hideLabelText: false,
        showFieldLabel: true,
        buttonText: 'Upload file',
        addAnotherLabel: 'Upload another file',
        attachmentType: {
          'ui:title': 'File type',
        },
        attachmentDescription: {
          'ui:title': 'Document description',
        },
        // TODO: Sync with b/e to determine proper URL
        fileUploadUrl: `${environment.API_URL}/v0/simple-forms/40-0247/files`,
        fileTypes: ['pdf', 'jpg', 'jpeg', 'png'],
        createPayload: file => {
          const payload = new FormData();
          payload.append('file', file);
          return payload;
        },
        parseResponse: fileInfo => ({
          name: fileInfo.data.attributes.name,
          size: fileInfo.data.attributes.size,
          confirmationCode: fileInfo.data.attributes.confirmationCode,
        }),
        classNames: 'schemaform-file-upload',
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      veteranSupportingDocuments: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          properties: {
            fileName: {
              type: 'string',
            },
            fileSize: {
              type: 'integer',
            },
            confirmationNumber: {
              type: 'string',
            },
            errorMessage: {
              type: 'string',
            },
            uploading: {
              type: 'boolean',
            },
          },
        },
      },
    },
  },
};
