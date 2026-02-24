import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { RequestNursingHomeInformationDescription } from '../../../components/Descriptions';
import { medicaidDoesNotCoverNursingHome } from './helpers';

export const requiresAdditionalEvidence = formData =>
  formData.medicaidStatus || formData.medicalCondition;

export default {
  title: 'Additional form needed',
  path: 'medical/status/additional-form-needed',
  initialData: {},
  depends: formData =>
    medicaidDoesNotCoverNursingHome(formData) && formData.medicaidStatus,
  uiSchema: {
    ...titleUI(
      'Additional form needed',
      RequestNursingHomeInformationDescription,
    ),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};
