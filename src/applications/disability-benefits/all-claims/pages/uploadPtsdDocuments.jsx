import React from 'react';
import { UploadDescription } from '../content/fileUploadDescriptions';
import { ptsd781NameTitle } from '../content/ptsdClassification';
import { ancillaryFormUploadUi, setDefaultAttachmentId } from '../utils';

const PTSD_781_ATTACHMENT_ID = 'L228';

export const uiSchema = {
  'ui:title': ptsd781NameTitle,
  'ui:description': <UploadDescription uploadTitle="Upload VA Form 21-0781" />,
  ptsd781: ancillaryFormUploadUi('', 'PTSD 781 form', {
    attachmentId: PTSD_781_ATTACHMENT_ID,
    customClasses: 'upload-completed-form',
    isDisabled: true,
  }),
};

export const schema = {
  type: 'object',
  required: ['ptsd781'],
  properties: {
    ptsd781: setDefaultAttachmentId(PTSD_781_ATTACHMENT_ID),
  },
};
