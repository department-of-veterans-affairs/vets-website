import { EvidenceUploadDescription } from '../content/EvidenceUpload';
import { evidenceUploadUI } from '../utils/upload';

export const evidenceUpload = {
  uiSchema: {
    'ui:description': EvidenceUploadDescription,
    evidence: evidenceUploadUI,
  },

  schema: {
    type: 'object',
    properties: {
      evidence: {
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
