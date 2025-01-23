import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { showMedicalEvidenceClarification } from '../../../helpers';
import { MedicalEvidenceNotice } from './helpers';

export const requiresAdditionalEvidence = formData =>
  formData.socialSecurityDisability || formData.medicalCondition;

export default {
  title: 'Other payment options',
  path: 'medical/evidence',
  initialData: {},
  depends: formData =>
    showMedicalEvidenceClarification() && requiresAdditionalEvidence(formData),
  uiSchema: {
    ...titleUI('Submit additional evidence', MedicalEvidenceNotice),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};
