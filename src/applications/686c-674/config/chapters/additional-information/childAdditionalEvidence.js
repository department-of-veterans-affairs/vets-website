import { titleUI } from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import { ChildAdditionalEvidence } from '../../../components/ChildAdditionalEvidence';
import { dependentsUploadSchema, dependentsUploadUI } from '../../upload';

const schema = {
  type: 'object',
  required: ['childSupportingDocuments'],
  properties: {
    'view:additionalEvidenceDescription': {
      type: 'object',
      properties: {},
    },
    childSupportingDocuments: dependentsUploadSchema,
  },
};

const uiSchema = {
  ...titleUI({
    title: 'Upload your supporting evidence to add your child',
    headingLevel: 3,
  }),
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
