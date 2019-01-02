import { UploadDescription } from '../content/fileUploadDescriptions';
import { ancillaryFormUploadUi } from '../utils';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';

const { attachments } = fullSchema.properties;
const unemployabilityComp = 'L149';

export const uiSchema = {
  'ui:title': 'Upload VA Form 21-8940',
  'ui:description': UploadDescription,
  form8940Upload: ancillaryFormUploadUi('', 'Adding additional evidence', {
    attachmentId: unemployabilityComp,
  }),
};

export const schema = {
  type: 'object',
  required: ['form8940Upload'],
  properties: {
    form8940Upload: attachments,
  },
};
