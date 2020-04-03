import environment from 'platform/utilities/environment';
import fileUploadUI from 'platform/forms-system/src/js/definitions/file';
import { childStatusDescription } from '../child-place-of-birth/childStatusDescription';
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
  'ui:title': 'Additional evidence needed to add child',
  'view:additionalEvidenceDescription': {
    'ui:description': AdditionalEvidence(childStatusDescription),
  },
  supportingDocuments: fileUploadUI('Additional Evidence needed', {
    buttonText: 'Upload supporting documents',
    fileUploadUrl: `${environment.API_URL}/v0/claim_attachments`,
    showFieldLabel: false,
    fileTypes: ['pdf', 'jpg', 'jpeg', 'png'],
  }),
};
