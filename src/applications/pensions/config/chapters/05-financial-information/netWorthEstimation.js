import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import {
  AssetInformationAlert,
  TotalNetWorthOverTwentyFiveThousandAlert,
} from '../../../components/FormAlerts';

export const hideIfUnder25000 = formData =>
  formData.netWorthEstimation === undefined ||
  parseInt(formData.netWorthEstimation, 10) <= 25000;

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Income and assets',
    'ui:description':
      'We need to know if you and your dependents have over $25,000 in assets.',
    'view:warningAlert': {
      'ui:description': AssetInformationAlert,
    },
    netWorthEstimation: currencyUI('Estimate the total value of your assets'),
    'view:warningAlertOnHighValue': {
      'ui:description': TotalNetWorthOverTwentyFiveThousandAlert,
      'ui:options': {
        hideIf: hideIfUnder25000,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['netWorthEstimation'],
    properties: {
      netWorthEstimation: {
        type: 'number',
      },
      'view:warningAlertOnHighValue': {
        type: 'object',
        properties: {},
      },
    },
  },
};
