import environment from 'platform/utilities/environment';

import { titleUI } from 'platform/forms-system/src/js/web-component-patterns/titlePattern';
import { FileField } from '../components/FileField';
import AlsViewField from '../components/AlsViewField';

import { ALS_DESCRIPTION } from '../config/constants';
import { createPayload, parseResponse } from '../helpers';

const uiTitle =
  'Upload evidence for diagnosis of ALS (amyotrophic lateral sclerosis)';
const uiDescription =
  'If you have documents you would like to submit as evidence of ALS, upload them here.';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(uiTitle, uiDescription),
    'ui:description': ALS_DESCRIPTION,
    'ui:objectViewField': AlsViewField,
    alsDocuments: {
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
        }/simple_forms_api/v1/simple_forms/submit_als_documents`,
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
      alsDocuments: {
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
