import { UploadDescription } from '../content/fileUploadDescriptions';
import { ancillaryFormUploadUi } from '../utils';

import full526EZSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';

const { attachments } = full526EZSchema.properties;

export const uiSchema = {
  additionalDocuments: {
    ...ancillaryFormUploadUi(
      'to lay statements or other evidence',
      'Adding additional evidence:',
      {
        addAnotherLabel: 'Add another document',
      },
    ),
    'ui:description': UploadDescription,
  },
};

export const schema = {
  type: 'object',
  required: ['additionalDocuments'],
  properties: {
    additionalDocuments: attachments,
  },
};
