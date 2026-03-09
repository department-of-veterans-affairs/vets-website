import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { SpecialMonthlyPensionEvidenceDescription } from '../../../components/Descriptions';

export default {
  title: 'Additional form needed',
  path: 'medical/history/monthly-pension/additional-form-needed',
  initialData: {},
  depends: formData => formData.specialMonthlyPension,
  uiSchema: {
    ...titleUI(
      'Additional form needed',
      SpecialMonthlyPensionEvidenceDescription,
    ),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};
