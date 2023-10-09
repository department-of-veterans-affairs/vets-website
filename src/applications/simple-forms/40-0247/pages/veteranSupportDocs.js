import environment from 'platform/utilities/environment';

import { FileField } from 'platform/forms-system/src/js/fields/FileField';

import {
  createPayload,
  parseResponse,
  supportingDocsDescription,
} from '../helpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:description': supportingDocsDescription,
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
        createPayload,
        parseResponse,
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
