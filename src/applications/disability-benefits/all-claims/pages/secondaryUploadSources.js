import { ancillaryFormUploadUi } from '../utils';

import { uploadDescription } from '../content/fileUploadDescriptions';
import { ptsd781aNameTitle } from '../content/ptsdClassification';

export const uiSchema = index => ({
  'ui:title': ptsd781aNameTitle,
  'ui:description': uploadDescription,
  [`secondaryUploadSources${index}`]: ancillaryFormUploadUi(
    '',
    'PTSD 781a form supporting documents',
    {},
  ),
});

export const schema = index => ({
  type: 'object',
  properties: {
    [`secondaryUploadSources${index}`]: {
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
});
