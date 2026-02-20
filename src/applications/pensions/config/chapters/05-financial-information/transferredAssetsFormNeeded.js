import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { IncomeAssetStatementFormNeededDescription } from '../../../components/FormAlerts';

export default {
  title: 'Additional form needed',
  path: 'financial/transferred-assets/additional-form-needed',
  initialData: {},
  depends: formData => formData.transferredAssets,
  uiSchema: {
    ...titleUI(
      'Additional form needed',
      IncomeAssetStatementFormNeededDescription,
    ),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};
