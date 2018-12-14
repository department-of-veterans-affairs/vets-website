import { ancillaryFormUploadUi } from '../utils';

import { uploadDescription } from '../content/fileUploadDescriptions';

export const uiSchema = {
  'ui:title': 'Upload supporting documents',
  'ui:description': uploadDescription,
  'view:uploadUnemployabilitySupportingDocuments': ancillaryFormUploadUi(
    '',
    'Individual Unemployability 8940 form supporting documents',
  ),
};

export const schema = {
  type: 'object',
  properties: {
    'view:uploadUnemployabilitySupportingDocuments': {
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
};
