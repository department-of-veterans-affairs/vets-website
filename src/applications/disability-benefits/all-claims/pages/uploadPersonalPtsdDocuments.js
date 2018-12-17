import { uploadDescription } from '../content/fileUploadDescriptions';
import { ptsd781aNameTitle } from '../content/ptsdClassification';
import { ancillaryFormUploadUi } from '../utils';

export const uiSchema = {
  'ui:title': ptsd781aNameTitle,
  'ui:description': uploadDescription,
  ptsd781a: ancillaryFormUploadUi('', 'PTSD 781a form'),
};

export const schema = {
  type: 'object',
  required: ['ptsd781a'],
  properties: {
    ptsd781a: {
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
