import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { ChildAdditionalEvidence } from '../../../components/ChildAdditionalEvidence';
import { dependentsUploadSchema, dependentsUploadUI } from '../../upload';

const schema = {
  type: 'object',
  // required: ['childSupportingDocuments'], // Enable after QA
  properties: {
    'view:additionalEvidenceDescription': {
      type: 'object',
      properties: {},
    },
    childSupportingDocuments: dependentsUploadSchema,
  },
};

const uiSchema = {
  ...titleUI('Upload your supporting evidence to add your child'),
  'view:additionalEvidenceDescription': {
    'ui:description': ChildAdditionalEvidence,
  },
  childSupportingDocuments: {
    ...dependentsUploadUI('Upload supporting documents'),
  },
};

export const childAdditionalEvidence = {
  uiSchema,
  schema,
};
