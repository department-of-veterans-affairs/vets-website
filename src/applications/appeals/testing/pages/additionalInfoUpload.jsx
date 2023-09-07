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

export default additionalInfoUpload;
