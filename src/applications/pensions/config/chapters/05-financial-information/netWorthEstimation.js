import {
  currencyUI,
  currencySchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  AssetInformationAlert,
  TotalNetWorthOverThresholdAlert,
} from '../../../components/FormAlerts';

export const hideIfUnder75000 = formData => {
  const value = parseInt(formData.netWorthEstimation, 10);
  return (
    formData.netWorthEstimation == null || // null or undefined
    Number.isNaN(value) ||
    value <= 75000
  );
};

/** @type {PageSchema} */
export default {
  title: 'Net worth estimation',
  path: 'financial/net-worth-estimation',
  depends: formData => formData.totalNetWorth === false,
  uiSchema: {
    ...titleUI(
      'Income and assets',
      'We need to know if you and your dependents have over $75,000 in assets.',
    ),
    'view:warningAlert': {
      'ui:description': AssetInformationAlert,
    },
    netWorthEstimation: currencyUI('Estimate the total value of your assets'),

    'view:warningAlertOnHighValue': {
      'ui:description': TotalNetWorthOverThresholdAlert,
      'ui:options': {
        hideIf: hideIfUnder75000,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['netWorthEstimation'],
    properties: {
      netWorthEstimation: currencySchema,
      'view:warningAlertOnHighValue': {
        type: 'object',
        properties: {},
      },
    },
  },
};
