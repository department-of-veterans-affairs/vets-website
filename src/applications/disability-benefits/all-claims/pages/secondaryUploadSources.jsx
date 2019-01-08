import React from 'react';

import { ancillaryFormUploadUi } from '../utils';

import { UploadDescription } from '../content/fileUploadDescriptions';
import { ptsd781aNameTitle } from '../content/ptsdClassification';

export const uiSchema = index => ({
  'ui:title': ptsd781aNameTitle,
  'ui:description': (
    <UploadDescription uploadTitle="Upload supporting documents" />
  ),
  [`secondaryUploadSources${index}`]: ancillaryFormUploadUi(
    '',
    'PTSD 781a form supporting documents',
    {},
  ),
});

export const schema = index => ({
  type: 'object',
  required: [`secondaryUploadSources${index}`],
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
