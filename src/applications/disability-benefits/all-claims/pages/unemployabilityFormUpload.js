import { UploadDescription } from '../content/fileUploadDescriptions';
import { ancillaryFormUploadUi } from '../utils';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';

const { attachments } = fullSchema.properties;
const unemployabilityComp = {
  enum: ['L149'],
  enumNames: [
    'VA 21-8940-Veterans Application for Increased Compensation Based on Unemployability',
  ],
};

export const uiSchema = {
  'ui:title': 'Upload VA Form 21-8940',
  'ui:description': UploadDescription,
  form8940Upload: ancillaryFormUploadUi('', 'Adding additional evidence', {
    attachmentId: unemployabilityComp,
    customClasses: 'upload-completed-form',
    isDisabled: true,
  }),
};

export const schema = {
  type: 'object',
  required: ['form8940Upload'],
  properties: {
    form8940Upload: attachments,
  },
};
