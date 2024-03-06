import environment from 'platform/utilities/environment';

import { titleUI } from 'platform/forms-system/src/js/web-component-patterns/titlePattern';
import { FileField } from '../components/FileField';
import VsiViewField from '../components/VsiViewField';

import { VSI_DESCRIPTION } from '../config/constants';
import { createPayload, parseResponse } from '../helpers';

const uiTitle =
  'Upload evidence for Seriously or Very Seriously Injured or Ill during military operations';
const uiDescription =
  'If you have documents you would like to submit as evidence of a disability resulting from a military operation that will likely result in a discharge from military service, upload them here.';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(uiTitle, uiDescription),
    'ui:description': VSI_DESCRIPTION,
    'ui:objectViewField': VsiViewField,
    vsiDocuments: {
      'ui:title': 'Upload additional evidence',
      'ui:field': FileField,
      'ui:options': {
        hideLabelText: false,
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
        }/simple_forms_api/v1/simple_forms/submit_vsi_documents`,
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
      vsiDocuments: {
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
