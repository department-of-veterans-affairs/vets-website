import { ancillaryFormUploadUi } from '../utils/schemas';

export const uiSchema = {
  separationHealthAssessmentUploads: ancillaryFormUploadUi(
    'Upload your separation health assessment',
    '',
  ),
};

export const schema = {
  type: 'object',
  properties: {
    separationHealthAssessmentUploads: {
      type: 'array',
      maxItems: 1,
      items: {
        type: 'object',
        required: ['name'],
        properties: {
          name: {
            type: 'string',
          },
          confirmationCode: {
            type: 'string',
          },
        },
      },
    },
  },
};
