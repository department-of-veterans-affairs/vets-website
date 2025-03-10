import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { SpouseAdditionalEvidence } from '../../../components/SpouseAdditionalEvidence';
import { dependentsUploadSchema, dependentsUploadUI } from '../../upload';

const schema = {
  type: 'object',
  required: ['spouseSupportingDocuments'],
  properties: {
    'view:additionalEvidenceDescription': {
      type: 'object',
      properties: {},
    },
    spouseSupportingDocuments: dependentsUploadSchema,
  },
};

const uiSchema = {
  ...titleUI({
    title: 'Submit supporting evidence to add your spouse',
    headingLevel: 3,
  }),
  'view:additionalEvidenceDescription': {
    'ui:description': SpouseAdditionalEvidence,
  },
  spouseSupportingDocuments: dependentsUploadUI('Upload supporting documents'),
};
export const spouseAdditionalEvidence = {
  uiSchema,
  schema,
};
