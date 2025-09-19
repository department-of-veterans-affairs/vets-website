import {
  currencyUI,
  currencySchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  AssetInformationAlert,
  TotalNetWorthOverThresholdAlert,
} from '../../../components/FormAlerts';
import { showPdfFormAlignment } from '../../../helpers';

const threshold = showPdfFormAlignment() ? 75000 : 25000;

export const hideIfUnderThreshold = formData => {
  const value = parseInt(formData.netWorthEstimation, 10);
  return (
    formData.netWorthEstimation == null || // null or undefined
    Number.isNaN(value) ||
    value <= threshold
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
      `We need to know if you and your dependents have over $${threshold.toLocaleString()} in assets.`,
    ),
    'view:warningAlert': {
      'ui:description': AssetInformationAlert,
    },
    netWorthEstimation: currencyUI('Estimate the total value of your assets'),

    'view:warningAlertOnHighValue': {
      'ui:description': TotalNetWorthOverThresholdAlert(threshold),
      'ui:options': {
        hideIf: hideIfUnderThreshold,
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
