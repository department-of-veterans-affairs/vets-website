import React from 'react';

import { displayFileSize } from 'platform/utilities/ui';

import { evidenceUploadUI } from '../utils/evidenceUpload';

export const evidenceUpload = {
  uiSchema: {
    evidence: evidenceUploadUI,
  },

  schema: {
    type: 'object',
    properties: {
      evidence: {
        title: 'evidence to be reviewed by the Board',
        type: 'array',
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

  review: data => ({
    'Evidence to be reviewed by the Board': (
      <ul>
        {data.evidence.map(file => (
          <li key={file.name}>
            {file.name} ({displayFileSize(file.size)})
          </li>
        ))}
      </ul>
    ),
  }),
};

export default evidenceUpload;
