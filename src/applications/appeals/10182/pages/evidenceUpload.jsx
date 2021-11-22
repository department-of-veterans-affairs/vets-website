import { evidenceUploadUI } from '../utils/upload';

export const evidenceUpload = {
  uiSchema: {
    evidence: evidenceUploadUI,
  },

  schema: {
    type: 'object',
    required: ['evidence'],
    properties: {
      evidence: {
        title: 'evidence to be reviewed by the Board',
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
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
  },
};

export default evidenceUpload;
