import { evidenceUploadUI } from '../utils/upload';
import { evidenceNote } from '../content/EvidenceUpload';

export const evidenceUpload = {
  uiSchema: {
    evidence: evidenceUploadUI,
    evidenceNote: {
      'ui:description': evidenceNote,
    },
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
      evidenceNote: {
        type: 'object',
        properties: {},
      },
    },
  },
};

export default evidenceUpload;
