import React from 'react';

import { UploadDescription } from '../content/fileUploadDescriptions';
import { ancillaryFormUploadUi, getAttachmentsSchema } from '../utils/schemas';
import { unemployabilityTitle } from '../content/unemployabilityFormIntro';

const PTSD_4192_ATTACHMENT_ID = 'L115';

export const uiSchema = {
  'ui:title': unemployabilityTitle,
  'ui:description': <UploadDescription uploadTitle="Upload VA Form 21-4192" />,
  form4192Upload: ancillaryFormUploadUi(
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
  required: ['form4192Upload'],
  properties: {
    form4192Upload: getAttachmentsSchema(PTSD_4192_ATTACHMENT_ID),
  },
};
