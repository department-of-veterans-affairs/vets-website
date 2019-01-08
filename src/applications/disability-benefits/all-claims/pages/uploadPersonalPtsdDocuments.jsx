import React from 'react';

import { UploadDescription } from '../content/fileUploadDescriptions';
import { ptsd781aNameTitle } from '../content/ptsdClassification';
import { ancillaryFormUploadUi, setDefaultAttachmentId } from '../utils';

const PTSD_781A_ATTACHMENT_ID = 'L229';

export const uiSchema = {
  'ui:title': ptsd781aNameTitle,
  'ui:description': <UploadDescription uploadTitle="Upload VA Form 21-0781a" />,
  form781aUpload: ancillaryFormUploadUi('', 'PTSD 781a form', {
    attachmentId: PTSD_781A_ATTACHMENT_ID,
    disabled: true,
  }),
};

export const schema = {
  type: 'object',
  required: ['ptsd781a'],
  properties: {
    form781aUpload: setDefaultAttachmentId(PTSD_781A_ATTACHMENT_ID),
  },
};
