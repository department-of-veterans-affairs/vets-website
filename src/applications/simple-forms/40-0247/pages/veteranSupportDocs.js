import environment from 'platform/utilities/environment';

import { titleUI } from 'platform/forms-system/src/js/web-component-patterns/titlePattern';
import { validateFileField } from 'platform/forms-system/src/js/validation';
import { FileField } from '../components/FileField';
import SupportingDocsViewField from '../components/SupportingDocsViewField';

import {
  createPayload,
  parseResponse,
  supportingDocsDescription,
} from '../helpers';

const uiTitle = environment.isProduction()
  ? 'Upload the Veteran’s or Reservist’s files (preferably DD214)'
  : 'Upload the Veteran’s or Reservist’s files';
const uiDescriptionNotProd =
  'We encourage you to submit military records or discharge documents if you have them. We prefer a DD214.';
const uiDescriptionProd =
  'We don’t require that you submit anything with this form. But to speed up the process, we encourage you to submit military records or discharge documents if they’re available.';
const uiDescription = environment.isProduction()
  ? uiDescriptionProd
  : uiDescriptionNotProd;

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(uiTitle, uiDescription),
    'ui:description': supportingDocsDescription,
    'ui:objectViewField': SupportingDocsViewField,
    veteranSupportingDocuments: {
      'ui:title': 'Upload documents',
      'ui:field': FileField,
      'ui:options': {
        hideLabelText: true,
        showFieldLabel: true,
        buttonText: 'Upload file',
        addAnotherLabel: 'Upload another file',
        ariaLabelAdditionalText: `${uiTitle}. ${uiDescription}`,
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
      'ui:validations': [validateFileField],
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
