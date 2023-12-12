/**
 * Used for the file upload inputs to collect health insurance
 * coverage cards.
 */
export const attachmentsConfig = {
  buttonText: 'Upload insurance card',
  // fileUploadUrl: `/v0/hca_attachments`, // TODO: need a valid URL
  fileTypes: ['pdf', 'jpg', 'jpeg', 'png'],
  maxSize: 1024 * 1024 * 10,
  hideLabelText: true,
  createPayload: file => {
    const payload = new FormData();
    payload.append('107959C_attachment[file_data]', file);
    return payload;
  },
  parseResponse: (response, file) => ({
    name: file.name,
    confirmationCode: response.data.attributes.guid,
    size: file.size,
  }),
  attachmentSchema: {
    'ui:title': 'Document type',
  },
  attachmentName: {
    'ui:title': 'Document name',
  },
};

export const attachmentsSchema = {
  type: 'array',
  minItems: 1,
  items: {
    type: 'object',
    required: ['name'],
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
