import { UploadDescription } from '../content/fileUploadDescriptions';
import { ancillaryFormUploadUi, getAttachmentsSchema } from '../utils/schemas';

const UNEMPLOYABILITY_8940_ATTACHMENT_ID = 'L149';

export const uiSchema = {
  'ui:title': 'Upload VA Form 21-8940',
  'ui:description': UploadDescription,
  form8940Upload: ancillaryFormUploadUi('', 'Upload VA Form 21-8940', {
    attachmentId: UNEMPLOYABILITY_8940_ATTACHMENT_ID,
    customClasses: 'upload-completed-form',
    isDisabled: true,
  }),
};

export const schema = {
  type: 'object',
  required: ['form8940Upload'],
  properties: {
    form8940Upload: getAttachmentsSchema(UNEMPLOYABILITY_8940_ATTACHMENT_ID),
  },
};
