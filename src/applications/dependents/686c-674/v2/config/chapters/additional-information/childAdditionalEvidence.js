import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { ChildAdditionalEvidence } from '../../../components/ChildAdditionalEvidence';
import { dependentsUploadSchema, dependentsUploadUI } from '../../upload';

const schema = {
  type: 'object',
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
