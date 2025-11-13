import full526EZSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';

import { UploadDescription } from '../content/fileUploadDescriptions';
import { ancillaryFormUploadUi } from '../utils/schemas';
import { selfAssessmentAlert } from '../content/selfAssessmentAlert';
import { isBDD } from '../utils';

const { attachments } = full526EZSchema.properties;

export const uiSchema = {
  'view:selfAssessmentAlert': {
    'ui:title': selfAssessmentAlert,
    'ui:options': {
      hideIf: formData => !isBDD(formData),
    },
  },
  additionalDocuments: {
    ...ancillaryFormUploadUi(
      'Supporting (lay) statements or other evidence',
      'Adding additional evidence:',
      {
        addAnotherLabel: 'Add another file',
        buttonText: 'Upload file',
      },
    ),
    'ui:description': UploadDescription,
    'ui:confirmationField': ({ formData }) => ({
      data: formData?.map(item => item.name || item.fileName),
      label: 'Uploaded file(s)',
    }),
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
