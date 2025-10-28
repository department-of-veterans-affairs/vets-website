import React from 'react';
import { UploadDescription } from '../content/fileUploadDescriptions';
import { ptsd781NameTitle } from '../content/ptsdClassification';
import { ancillaryFormUploadUi, getAttachmentsSchema } from '../utils/schemas';

const PTSD_781_ATTACHMENT_ID = 'L228';

export const uiSchema = {
  'ui:title': ptsd781NameTitle,
  'ui:description': <UploadDescription uploadTitle="Upload VA Form 21-0781" />,
  form781Upload: {
    ...ancillaryFormUploadUi('', 'PTSD 781 form', {
      attachmentId: PTSD_781_ATTACHMENT_ID,
      customClasses: 'upload-completed-form',
      isDisabled: true,
    }),
    'ui:confirmationField': ({ formData }) => ({
      data: formData?.map(item => item.name || item.fileName),
      label: 'Uploaded file(s)',
    }),
  },
};

export const schema = {
  type: 'object',
  required: ['form781Upload'],
  properties: {
    form781Upload: getAttachmentsSchema(PTSD_781_ATTACHMENT_ID),
  },
};
