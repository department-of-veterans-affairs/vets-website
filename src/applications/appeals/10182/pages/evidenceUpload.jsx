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
        // FileField line 402 aria-label shows [object Object] when the
        // uiSchema['ui:title'] is a React component; will move schema.title
        // first in another PR => "add another document " + title below
        title: 'to be reviewed by the Board',
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
