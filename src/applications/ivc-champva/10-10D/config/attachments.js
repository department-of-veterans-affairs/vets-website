// Schema for use with fileUploadUI

// Images + pdf
export const fileTypes = ['jpeg', 'jpg', 'png', 'pdf'];
export const maxSize = '20MB'; // This appears to be the current limit
export const minSize = '1.0KB';

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

export const fileWithMetadataSchema = possibleFiles => {
  const enu = possibleFiles || [];

  return {
    type: 'array',
    minItems: 1,
    items: {
      type: 'object',
      required: ['attachmentId', 'name'],
      properties: {
        name: {
          type: 'string',
        },
        size: {
          type: 'integer',
        },
        errorMessage: {
          type: 'string',
        },
        confirmationCode: {
          type: 'string',
        },
        attachmentId: {
          type: 'string',
          enum: [...enu],
          enumNames: enu,
        },
      },
    },
  };
};
