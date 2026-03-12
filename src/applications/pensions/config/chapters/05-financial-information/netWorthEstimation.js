import {
  currencyUI,
  currencySchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { AssetInformationAlert } from '../../../components/FormAlerts';

/** @type {PageSchema} */
export default {
  title: 'Net worth estimation',
  path: 'financial/net-worth-estimation',
  depends: formData => formData.totalNetWorth === false,
  uiSchema: {
    ...titleUI('Net worth estimation'),
    'view:warningAlert': {
      'ui:description': AssetInformationAlert,
    },
    netWorthEstimation: currencyUI('Estimate the total value of your assets'),
  },
  schema: {
    type: 'object',
    required: ['netWorthEstimation'],
    properties: {
      netWorthEstimation: currencySchema,
    },
  },
};
