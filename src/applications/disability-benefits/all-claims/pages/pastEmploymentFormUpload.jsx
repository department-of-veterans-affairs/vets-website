import React from 'react';

import { UploadDescription } from '../content/fileUploadDescriptions';
import { ancillaryFormUploadUi } from '../utils';
import { unemployabilityTitle } from '../content/unemployabilityFormIntro';

const PTSD_4192_ATTACHMENT_ID = 'L115';

export const uiSchema = {
  'ui:title': unemployabilityTitle,
  'ui:description': <UploadDescription uploadTitle="Upload VA Form 21-4192" />,
  uploaded4192: ancillaryFormUploadUi(
    '',
    'Individual Unemployability 4192 form documents',
    {
      attachmentId: PTSD_4192_ATTACHMENT_ID,
      customClasses: 'upload-completed-form',
      isDisabled: true,
    },
  ),
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
