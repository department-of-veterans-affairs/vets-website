import { uploadDescription } from '../content/fileUploadDescriptions';
import { ptsd781NameTitle } from '../content/ptsdClassification';
import { ancillaryFormUploadUi } from '../utils';

export const uiSchema = {
  'ui:title': ptsd781NameTitle,
  'ui:description': uploadDescription,
  ptsd781: ancillaryFormUploadUi('', 'PTSD 781 form'),
};

export const schema = {
  type: 'object',
  required: ['ptsd781'],
  properties: {
    ptsd781: {
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
