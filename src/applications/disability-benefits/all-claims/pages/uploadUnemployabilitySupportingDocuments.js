import { ancillaryFormUploadUi } from '../utils';
import { uploadDescription } from '../content/fileUploadDescriptions';
import { unemployabilityTitle } from '../content/unemployabilityFormIntro';

export const uiSchema = {
  'ui:title': unemployabilityTitle,
  'ui:description': uploadDescription,
  unemployabilitySupportingDocuments: ancillaryFormUploadUi(
    '',
    'Individual Unemployability 8940 form supporting documents',
  ),
};

export const schema = {
  type: 'object',
  properties: {
    unemployabilitySupportingDocuments: {
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
