// Schema for use with fileUploadUI

// Images + pdf
export const fileTypes = ['bmp', 'heic', 'jpeg', 'jpg', 'pdf', 'png'];
export const maxSize = '1.0MB'; // Arbitrary - TODO: update in future.

export const attachmentsSchema = {
  type: 'array',
  minItems: 1,
  items: {
    type: 'object',
    properties: {
      fileName: {
        type: 'string',
      },
      fileSize: {
        type: 'integer',
      },
      confirmationNumber: {
        type: 'string',
      },
      errorMessage: {
        type: 'string',
      },
      uploading: {
        type: 'boolean',
      },
    },
  },
};
