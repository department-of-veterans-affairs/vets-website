import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { NetWorthEstimationFormNeededDescription } from '../../../components/Descriptions';
import { netWorthEstimateIsOverThreshold } from '../../../helpers';

export default {
  title: 'Additional form needed',
  path: 'financial/net-worth-estimation/additional-form-needed',
  initialData: {},
  depends: formData =>
    formData.totalNetWorth || netWorthEstimateIsOverThreshold(formData),
  uiSchema: {
    ...titleUI(
      'Additional form needed',
      NetWorthEstimationFormNeededDescription,
    ),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};
