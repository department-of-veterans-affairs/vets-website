import { UploadDescription } from '../content/fileUploadDescriptions';
import { ptsd781aNameTitle } from '../content/ptsdClassification';
import { ancillaryFormUploadUi, getAttachmentsSchema } from '../utils/schemas';

const PTSD_781A_ATTACHMENT_ID = 'L229';

const fileUploadUi = ancillaryFormUploadUi(
  ptsd781aNameTitle,
  'Upload your service treatment records',
  {
    attachmentId: PTSD_781A_ATTACHMENT_ID,
    addAnotherLabel: 'upload-completed-form',
    isDisabled: true,
    buttonText: 'Upload file',
  },
);

export const uiSchema = {
  form781aUpload: {
    ...fileUploadUi,
    'ui:options': { ...fileUploadUi['ui:options'] },
    'ui:description': UploadDescription,
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
