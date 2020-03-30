import assign from 'lodash/assign';
import fileUploadUI from 'platform/forms-system/src/js/definitions/file';
import { marriageTypeInformation } from '../current-marriage-information/helpers';
import { AdditionalEvidence } from '../../../../components/AdditionalEvidence';
import { genericSchemas } from '../../../generic-schema';

const { fileSchema } = genericSchemas;

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
  'ui:title': 'Additional evidence needed to add spouse',
  'view:additionalEvidenceDescription': {
    'ui:description': AdditionalEvidence(marriageTypeInformation),
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
