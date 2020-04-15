import environment from 'platform/utilities/environment';
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
    supportingDocuments: fileSchema,
  },
};

export const uiSchema = {
  'ui:title': 'Additional evidence needed to add spouse',
  'view:additionalEvidenceDescription': {
    'ui:description': AdditionalEvidence(marriageTypeInformation),
  },
  supportingDocuments: fileUploadUI('Additional Evidence needed', {
    buttonText: 'Upload supporting documents',
    fileUploadUrl: `${environment.API_URL}/v0/claim_attachments`,
    showFieldLabel: false,
    fileTypes: ['pdf', 'jpg', 'jpeg', 'png'],
  }),
};
