import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { SpouseAdditionalEvidence } from '../../../components/SpouseAdditionalEvidence';
import { dependentsUploadSchema, dependentsUploadUI } from '../../upload';

const schema = {
  type: 'object',
  // required: ['spouseSupportingDocuments'], // Enable after QA
  properties: {
    'view:additionalEvidenceDescription': {
      type: 'object',
      properties: {},
    },
    spouseSupportingDocuments: dependentsUploadSchema,
  },
};

const uiSchema = {
  ...titleUI('Submit supporting evidence to add your spouse'),
  'view:additionalEvidenceDescription': {
    'ui:description': SpouseAdditionalEvidence,
  },
  spouseSupportingDocuments: dependentsUploadUI('Upload supporting documents'),
};
export const spouseAdditionalEvidence = {
  uiSchema,
  schema,
};
