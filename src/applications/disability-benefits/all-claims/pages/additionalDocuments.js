import full526EZSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';

import { UploadDescription } from '../content/fileUploadDescriptions';
import { ancillaryFormUploadUi } from '../utils/schemas';
import { selfAssessmentAlert } from '../content/selfAssessmentAlert';

const { attachments } = full526EZSchema.properties;

export const uiSchema = {
  'view:selfAssessmentAlert': {
    'ui:title': selfAssessmentAlert,
  },
  additionalDocuments: {
    ...ancillaryFormUploadUi(
      'Supporting (lay) statements or other evidence',
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
    'view:selfAssessmentAlert': {
      type: 'object',
      properties: {},
    },
    additionalDocuments: attachments,
  },
};
