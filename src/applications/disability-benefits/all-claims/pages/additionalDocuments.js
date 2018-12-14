import { uploadDescription } from '../content/fileUploadDescriptions';
import { ancillaryFormUploadUi } from '../utils';

import full526EZSchema from '../config/schema';

const { attachments } = full526EZSchema.properties;

export const uiSchema = {
  additionalDocuments: {
    ...ancillaryFormUploadUi(
      'Lay statements or other evidence',
      'Adding additional evidence:',
      {},
    ),
    'ui:description': uploadDescription,
  },
};

export const schema = {
  type: 'object',
  required: ['additionalDocuments'],
  properties: {
    additionalDocuments: attachments,
  },
};
