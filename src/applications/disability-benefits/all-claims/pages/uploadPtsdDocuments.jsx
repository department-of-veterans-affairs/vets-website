import { ptsd781NameTitle } from '../content/ptsdClassification';
import { ancillaryFormUploadUi, getAttachmentsSchema } from '../utils/schemas';

const PTSD_781_ATTACHMENT_ID = 'L228';

const fileUploadUi = ancillaryFormUploadUi(
  ptsd781NameTitle,
  'Upload VA Form 21-0781',
  {
    attachmentId: PTSD_781_ATTACHMENT_ID,
    addAnotherLabel: 'upload-completed-form',
    isDisabled: true,
    buttonText: 'Upload file(s)',
  },
);

export const uiSchema = {
  form781Upload: {
    ...fileUploadUi,
    'ui:options': { ...fileUploadUi['ui:options'] },
    'ui:description': 'Upload VA Form 21-0781',
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
