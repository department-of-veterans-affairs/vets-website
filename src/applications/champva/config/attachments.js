// Schema for use with fileUploadUI

// Images + pdf
export const fileTypes = ['bmp', 'heic', 'jpeg', 'jpg', 'pdf', 'png'];

export const attachmentsSchema = {
  type: 'array',
  minItems: 1,
  items: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
      size: {
        type: 'integer',
      },
      confirmationCode: {
        type: 'string',
      },
    },
  },
};
