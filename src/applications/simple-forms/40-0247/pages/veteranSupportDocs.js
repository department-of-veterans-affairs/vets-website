import React from 'react';

import environment from 'platform/utilities/environment';

import { FileField } from 'platform/forms-system/src/js/fields/FileField';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:description': (
      <>
        <p>
          We don’t require that you submit anything with this form. But to speed
          up the process, we encourage you to submit military records or
          discharge documents if they’re available.
        </p>
        <p>
          To be eligible for a Presidential Memorial Certificate, the deceased
          Veteran or Reservist must meet eligibility requirements for burial in
          a VA national cemetery.
        </p>
        <p>Not sure if the Veteran or Reservist is eligible?</p>
        <p>
          <a href="/burials-memorials/eligibility/">
            Check eligibility requirements for burial in a VA national cemetary
          </a>
        </p>
        <p className="vads-u-margin-bottom--4">
          We prefer that you upload the Veteran’s or Reservist’s DD214.
        </p>
      </>
    ),
    veteranSupportingDocuments: {
      'ui:title': 'Upload documents',
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
