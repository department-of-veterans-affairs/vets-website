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
    'Evidence to be reviewed by the Board':
      data.evidence?.length > 0 ? (
        <ul>
          {data.evidence.map(file => (
            <li key={file.name}>
              {file.name} ({displayFileSize(file.size)})
            </li>
          ))}
        </ul>
      ) : (
        'No files were uploaded'
      ),
  }),
};

export default evidenceUpload;
