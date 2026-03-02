import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { MedicalEvidenceNotice } from './helpers';

export const requiresAdditionalEvidence = formData =>
  formData.socialSecurityDisability || formData.medicalCondition;

export default {
  title: 'Medical records needed',
  path: 'medical/evidence',
  initialData: {},
  depends: formData => requiresAdditionalEvidence(formData),
  uiSchema: {
    ...titleUI('Medical records needed', MedicalEvidenceNotice),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};
