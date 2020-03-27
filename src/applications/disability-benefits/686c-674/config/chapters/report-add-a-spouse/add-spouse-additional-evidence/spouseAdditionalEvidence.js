import assign from 'lodash/assign';
import fileUploadUI from 'platform/forms-system/src/js/definitions/file';

const fileSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      size: { type: 'integer' },
      confirmationCode: { type: 'string' },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:additionalEvidenceDescription': {
      type: 'object',
      properties: {},
    },
    supportingDocuments: assign(fileSchema, {
      minItems: 1,
    }),
  },
};

export const uiSchema = {
  supportingDocuments: fileUploadUI('Additional Evidence needed', {
    fileUploadUrl: '',
  }),
};
