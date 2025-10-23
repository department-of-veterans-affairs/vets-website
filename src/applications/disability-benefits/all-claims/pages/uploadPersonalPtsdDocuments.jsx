import React from 'react';
import { UploadDescription } from '../content/fileUploadDescriptions';
import { ptsd781aNameTitle } from '../content/ptsdClassification';
import { ancillaryFormUploadUi, getAttachmentsSchema } from '../utils/schemas';

const PTSD_781A_ATTACHMENT_ID = 'L229';

export const uiSchema = {
  'ui:title': ptsd781aNameTitle,
  'ui:description': <UploadDescription uploadTitle="Upload VA Form 21-0781a" />,
  form781aUpload: {
    ...ancillaryFormUploadUi('', 'PTSD 781a form', {
      attachmentId: PTSD_781A_ATTACHMENT_ID,
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
  required: ['form781aUpload'],
  properties: {
    form781aUpload: getAttachmentsSchema(PTSD_781A_ATTACHMENT_ID),
  },
};
