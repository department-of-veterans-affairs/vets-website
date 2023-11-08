import environment from 'platform/utilities/environment';

import { titleUI } from 'platform/forms-system/src/js/web-component-patterns/titlePattern';
import { FileField } from 'platform/forms-system/src/js/fields/FileField';
import SupportingDocsViewField from '../components/SupportingDocsViewField';

import {
  createPayload,
  parseResponse,
  supportingDocsDescription,
} from '../helpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Upload documents (preferably DD214)'),
    'ui:description': supportingDocsDescription,
    'ui:objectViewField': SupportingDocsViewField,
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
        fileUploadUrl: `${
          environment.API_URL
        }/simple_forms_api/v1/simple_forms/submit_supporting_documents`,
        fileTypes: ['pdf', 'jpg', 'jpeg', 'png'],
        createPayload,
        parseResponse,
        keepInPageOnReview: true,
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
