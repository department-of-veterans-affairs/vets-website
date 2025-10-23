import React from 'react';

import { displayFileSize } from 'platform/utilities/ui';

import { additionalInfoUploadUI } from '../utils/additionalInfoUpload';

export const additionalInfoUpload = {
  uiSchema: {
    additionalInfoUpload: additionalInfoUploadUI,
  },

  schema: {
    type: 'object',
    properties: {
      additionalInfoUpload: {
        title: 'additional info to be reviewed by the Board',
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
    'Additional info to be reviewed:': data.additionalInfoUpload?.length ? (
      <ul>
        {data.additionalInfoUpload.map(file => (
          <li key={file.name}>
            {file.name} ({displayFileSize(file.size)})
          </li>
        ))}
      </ul>
    ) : (
      'No uploads added'
    ),
  }),
};

export default additionalInfoUpload;
