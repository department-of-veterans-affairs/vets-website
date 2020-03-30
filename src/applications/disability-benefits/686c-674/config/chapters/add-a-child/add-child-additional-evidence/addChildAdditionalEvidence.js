import assign from 'lodash/assign';
import fileUploadUI from 'platform/forms-system/src/js/definitions/file';
import { childStatusDescription } from '../child-place-of-birth/childStatusDescription';
import { AdditionalEvidence } from '../../../../components/AdditionalEvidence';

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
  'ui:title': 'Additional evidence needed to add child',
  'view:additionalEvidenceDescription': {
    'ui:description': AdditionalEvidence(childStatusDescription),
  },
  supportingDocuments: fileUploadUI('Additional Evidence needed', {
    buttonText: 'Upload supporting documents',
    fileUploadUrl: '',
    showFieldLabel: false,
    fileTypes: [
      'pdf',
      'gif',
      'tif',
      'tiff',
      'jpeg',
      'jpg',
      'png',
      'bmp',
      'txt',
    ],
  }),
};
