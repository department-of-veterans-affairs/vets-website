import { DocumentDescription } from '../content/uploadPtsdDocuments';
import { ancillaryFormUploadUi } from '../utils';

export const uiSchema = {
  'ui:title': 'Upload VA Form 21-4192',
  'ui:description': DocumentDescription,
  uploaded4192: ancillaryFormUploadUi('21-4192 form'),
};

export const schema = {
  type: 'object',
  required: ['uploaded4192'],
  properties: {
    uploaded4192: {
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
